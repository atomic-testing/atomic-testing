#!/usr/bin/env -S pnpm tsx
// Stateless dependabot PR triage.
//
// Rules (mirrors the manual triage policy applied to PRs #1136-#1262):
//   - CI failing on the current head, or a real merge conflict with main -> close.
//   - CI passing, head behind main               -> update the branch, re-check next run.
//   - CI passing, head already up to date with main -> approve + squash merge.
//   - CI still running                            -> no action this run.
//
// Deliberately re-entrant and single-step-per-run: it never blocks waiting for CI,
// so it tolerates a CI queue that can take a long time to drain (see
// .github/workflows/triage-dependabot-prs.yml, which re-invokes this on a schedule).
// No DEP-PIN-01 (or any other) special-casing - every failing check is blocking.
//
// Runs the same way locally as in CI - no GitHub Actions context is required:
//   GITHUB_TOKEN=<pat with repo + workflow scopes> pnpm triage:dependabot
//   GITHUB_TOKEN=$(gh auth token) pnpm triage:dependabot   # reuse an existing gh login
// Pass --dry-run to log the close/update/approve-and-merge decisions without making
// them - useful for previewing what a run would do before letting it touch real PRs.
import { Octokit } from '@octokit/rest';

const DRY_RUN = process.argv.includes('--dry-run');

const OWNER = 'atomic-testing';
const REPO = 'atomic-testing';
const DEPENDABOT_LOGIN = 'dependabot[bot]';
const MERGE_METHOD = 'squash' as const;
const PASSING_CONCLUSIONS = new Set(['success', 'neutral', 'skipped']);

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

const octokit = new Octokit({ auth: requireEnv('GITHUB_TOKEN') });

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

async function triagePullRequest(pull: TriagedPull): Promise<void> {
  const pullNumber = pull.number;

  if (pull.draft === true) {
    console.log(`#${pullNumber}: skipped (draft)`);
    return;
  }

  const ci = await getCiResult(pull.head.sha);

  if (ci.status === 'failing') {
    await closePullRequest(pullNumber, `CI failing on the current commit (${ci.failingChecks.join(', ')}).`);
    return;
  }

  if (ci.status === 'pending') {
    console.log(`#${pullNumber}: CI still running, no action this run`);
    return;
  }

  if (await isBehindBase(pull.base.ref, pull.head.sha)) {
    const result = await updateBranch(pullNumber);
    if (result === 'conflict') {
      await closePullRequest(pullNumber, 'merge conflict with main.');
    } else if (result === 'updated') {
      console.log(`#${pullNumber}: branch update triggered, will re-check CI next run`);
    }
    return;
  }

  await approveAndMerge(pullNumber);
}

async function main(): Promise<void> {
  const pulls = await octokit.paginate(octokit.pulls.list, {
    owner: OWNER,
    repo: REPO,
    state: 'open',
    per_page: 100,
  });

  const dependabotPulls = pulls.filter(pull => pull.user?.login === DEPENDABOT_LOGIN);
  console.log(`Found ${dependabotPulls.length} open dependabot PR(s)`);

  for (const pull of dependabotPulls) {
    try {
      await triagePullRequest(pull);
    } catch (error) {
      console.error(`#${pull.number}: error during triage`, error);
    }
  }
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
