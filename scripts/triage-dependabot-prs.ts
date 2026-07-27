#!/usr/bin/env -S pnpm tsx
// Standalone local dependabot PR triage - no GitHub Actions/YAML involved. Run it
// on demand:
//   pnpm triage:dependabot             # loop until every open dependabot PR is
//                                       # closed or merged, then exit
//   pnpm triage:dependabot --dry-run   # same loop, logs decisions without making them
//
// Auth: uses GITHUB_TOKEN if set, otherwise shells out to `gh auth token` (requires
// `gh auth login` once). Needs repo scope: contents:write, pull-requests:write,
// issues:write.
//
// Rules per PR (mirrors the manual triage policy applied to PRs #1136-#1262):
//   - CI failing on the current head, or a real merge conflict with main -> close.
//   - CI passing, head behind main               -> update the branch, re-check next pass.
//   - CI passing, head already up to date with main -> approve + squash merge.
//   - CI still running                            -> no action this pass.
// No DEP-PIN-01 (or any other) special-casing - every failing check is blocking.
//
// The rules above only ever make one decision per PR per pass - a branch update or a
// pending CI run needs time to resolve - so main() re-polls every POLL_INTERVAL_MS
// until no open dependabot PRs remain (dependabot opens new ones on its own weekly
// schedule, so this converges on the current backlog rather than running forever).
//
// At most one branch update is ever in flight at a time, globally - not per pass.
// Merging any single PR moves main, which immediately makes every *other* just-updated
// branch behind again; updating multiple PRs while one is still mid-CI risks an
// unrelated merge landing in between and invalidating several in-flight updates at
// once instead of just one. A PR counts as "in flight" the moment its branch is
// updated and stays that way until its CI resolves - detected statelessly each pass
// by checking whether *any* dependabot PR currently has pending CI, so this holds even
// across separate invocations of this script (no run remembers what an earlier run
// did). Merges don't need the same treatment: isBehindBase is re-checked live
// immediately before each one, so merging PR A and then re-checking PR B naturally
// finds B now behind (and defers it instead of merging onto a stale base) - and a
// merge itself never starts a new CI run (buildui.yml triggers on pull_request, not
// push, so landing on main doesn't retrigger anything).
import { execFileSync } from 'node:child_process';

import { Octokit } from '@octokit/rest';

const DRY_RUN = process.argv.includes('--dry-run');
const POLL_INTERVAL_MS = 60_000;

const OWNER = 'atomic-testing';
const REPO = 'atomic-testing';
const DEPENDABOT_LOGIN = 'dependabot[bot]';
const MERGE_METHOD = 'squash' as const;
const PASSING_CONCLUSIONS = new Set(['success', 'neutral', 'skipped']);

function resolveGithubToken(): string {
  if (process.env.GITHUB_TOKEN) return process.env.GITHUB_TOKEN;
  try {
    return execFileSync('gh', ['auth', 'token'], { encoding: 'utf8' }).trim();
  } catch {
    throw new Error(
      'No GITHUB_TOKEN set and `gh auth token` failed - run `gh auth login`, or set GITHUB_TOKEN directly.'
    );
  }
}

const octokit = new Octokit({ auth: resolveGithubToken() });

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

type CiStatus = 'pending' | 'passing' | 'failing';

interface CiResult {
  status: CiStatus;
  failingChecks: string[];
}

async function getCiResult(ref: string): Promise<CiResult> {
  const checkRuns = await octokit.paginate(octokit.checks.listForRef, {
    owner: OWNER,
    repo: REPO,
    ref,
    per_page: 100,
  });

  if (checkRuns.length === 0) {
    return { status: 'pending', failingChecks: [] };
  }

  const failingChecks = checkRuns
    .filter(run => run.status === 'completed' && !PASSING_CONCLUSIONS.has(run.conclusion ?? ''))
    .map(run => run.name);

  if (failingChecks.length > 0) {
    return { status: 'failing', failingChecks };
  }

  const stillRunning = checkRuns.some(run => run.status !== 'completed');
  return { status: stillRunning ? 'pending' : 'passing', failingChecks: [] };
}

// If the PR branch already contains every commit on `base`, merging it can never
// conflict - so this alone is enough to distinguish "needs an update" from "safe to merge".
async function isBehindBase(base: string, head: string): Promise<boolean> {
  const { data } = await octokit.repos.compareCommitsWithBasehead({
    owner: OWNER,
    repo: REPO,
    basehead: `${base}...${head}`,
  });
  return data.behind_by > 0;
}

async function closePullRequest(pullNumber: number, reason: string): Promise<void> {
  if (DRY_RUN) {
    console.log(`#${pullNumber}: [dry-run] would close (${reason})`);
    return;
  }
  await octokit.issues.createComment({
    owner: OWNER,
    repo: REPO,
    issue_number: pullNumber,
    body: `Closing: ${reason}`,
  });
  await octokit.pulls.update({ owner: OWNER, repo: REPO, pull_number: pullNumber, state: 'closed' });
  console.log(`#${pullNumber}: closed (${reason})`);
}

function isConflictError(error: unknown): boolean {
  return typeof error === 'object' && error !== null && (error as { status?: unknown }).status === 422;
}

// Returns 'conflict' rather than throwing on a 422, since a real merge conflict
// is an expected outcome here, not an operational failure.
async function updateBranch(pullNumber: number): Promise<'updated' | 'conflict' | 'dry-run'> {
  if (DRY_RUN) {
    // Whether this would conflict is only knowable by attempting the merge, so
    // dry-run can't distinguish the two outcomes without mutating - report the
    // decision (behind base -> needs an update) and stop there.
    console.log(`#${pullNumber}: [dry-run] would update branch (behind base)`);
    return 'dry-run';
  }
  try {
    await octokit.pulls.updateBranch({ owner: OWNER, repo: REPO, pull_number: pullNumber });
    return 'updated';
  } catch (error) {
    if (isConflictError(error)) return 'conflict';
    throw error;
  }
}

async function approveAndMerge(pullNumber: number): Promise<void> {
  if (DRY_RUN) {
    console.log(`#${pullNumber}: [dry-run] would approve and merge`);
    return;
  }
  await octokit.pulls.createReview({
    owner: OWNER,
    repo: REPO,
    pull_number: pullNumber,
    event: 'APPROVE',
    body: 'CI passing and branch up to date with main. Approving via automated dependabot triage.',
  });
  await octokit.pulls.merge({ owner: OWNER, repo: REPO, pull_number: pullNumber, merge_method: MERGE_METHOD });
  console.log(`#${pullNumber}: approved and merged`);
}

interface TriagedPull {
  number: number;
  draft?: boolean;
  head: { sha: string };
  base: { ref: string };
}

// Returns true iff this call started a new branch update - the caller uses that to
// keep updateInFlight accurate for the rest of the pass (see main()).
async function triagePullRequest(pull: TriagedPull, ci: CiResult, updateInFlight: boolean): Promise<boolean> {
  const pullNumber = pull.number;

  if (pull.draft === true) {
    console.log(`#${pullNumber}: skipped (draft)`);
    return false;
  }

  if (ci.status === 'failing') {
    await closePullRequest(pullNumber, `CI failing on the current commit (${ci.failingChecks.join(', ')}).`);
    return false;
  }

  if (ci.status === 'pending') {
    console.log(`#${pullNumber}: CI still running, no action this pass`);
    return false;
  }

  if (await isBehindBase(pull.base.ref, pull.head.sha)) {
    if (updateInFlight) {
      console.log(`#${pullNumber}: behind base, deferring update - another branch update is still in flight`);
      return false;
    }

    const result = await updateBranch(pullNumber);
    if (result === 'conflict') {
      // Rejected without triggering a CI run, so nothing is "in flight" from this.
      await closePullRequest(pullNumber, 'merge conflict with main.');
      return false;
    }
    if (result === 'updated') {
      console.log(`#${pullNumber}: branch update triggered, will re-check CI next pass`);
    }
    return true;
  }

  await approveAndMerge(pullNumber);
  return false;
}

async function main(): Promise<void> {
  for (;;) {
    const pulls = await octokit.paginate(octokit.pulls.list, {
      owner: OWNER,
      repo: REPO,
      state: 'open',
      per_page: 100,
    });

    // Oldest first, so a steady stream of new dependabot PRs (created newest-first by
    // the list API) can never starve out the ones already waiting in the queue.
    const dependabotPulls = pulls
      .filter(pull => pull.user?.login === DEPENDABOT_LOGIN)
      .sort((a, b) => a.number - b.number);

    if (dependabotPulls.length === 0) {
      console.log('No open dependabot PRs remain.');
      return;
    }

    console.log(`Found ${dependabotPulls.length} open dependabot PR(s)`);

    // Computed once per PR up front (not re-fetched inside triagePullRequest) so it can
    // double as the "is anything already in flight" check below before any action runs.
    const ciByPr = new Map<number, CiResult>();
    for (const pull of dependabotPulls) {
      ciByPr.set(pull.number, await getCiResult(pull.head.sha));
    }

    let updateInFlight = [...ciByPr.values()].some(ci => ci.status === 'pending');
    for (const pull of dependabotPulls) {
      try {
        const startedUpdate = await triagePullRequest(pull, ciByPr.get(pull.number)!, updateInFlight);
        if (startedUpdate) updateInFlight = true;
      } catch (error) {
        console.error(`#${pull.number}: error during triage`, error);
      }
    }

    if (DRY_RUN) {
      // A dry run never changes PR state, so re-polling would just repeat the same
      // decisions forever - one pass is the whole preview.
      console.log('[dry-run] stopping after one pass.');
      return;
    }

    console.log(`Sleeping ${POLL_INTERVAL_MS / 1000}s before re-checking...`);
    await sleep(POLL_INTERVAL_MS);
  }
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
