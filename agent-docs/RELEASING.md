# Releasing

How `@atomic-testing/*` packages reach npm. Publishing runs in CI on GitHub
**release publish** via [`publish.yml`](../.github/workflows/publish.yml), which
builds and publishes every non-excluded, **non-`private`** package through
[`publish.sh`](../publish.sh) using **npm Trusted Publishing (OIDC)** — no
long-lived npm token. Packages marked `"private": true` (the `internal-*` test
tooling, example harness, and MUI-X fixture) are still **built** — the repo's own
tests consume their `dist` — but are never published.

## Cut a release

**Actions → [Release](../.github/workflows/release.yml) → Run workflow → leave
"Use workflow from" on `main` → enter `X.Y.Z`.** That is the whole thing. Do not
create the GitHub Release by hand — see
[Why you no longer tag by hand](#why-you-no-longer-tag-by-hand).

The ref selector matters, which is why the run refuses outright if it is set to
anything but the default branch: left unchecked, a release dispatched from a
feature branch would bump and tag a commit that is not on `main` and publish it
to npm as `latest`, bypassing branch protection entirely.

The workflow bumps all 38 manifests, generates the `CHANGELOG.md` section,
commits that to `main`, tags **that commit**, publishes the GitHub Release, and
starts [`publish.yml`](../.github/workflows/publish.yml) against the new tag.
Tick **preview** first if you want to read the generated changelog before
anything moves — it runs the bump and prints the section into the run summary,
then stops without pushing, tagging or publishing.

Then two things remain:

1. Verify: `npm view @atomic-testing/core version` → `X.Y.Z`.
2. Float the consumers, now that the versions exist on npm:
   `pnpm bumpVersion X.Y.Z --consumers`, regenerate the standalone lockfiles (see
   below), and open that as a follow-up PR.

Step 2 stays separate on purpose. `examples/*` and `docs/` install the
**published** packages, so bumping their specifiers alongside the release would
point them at a version that is not on the registry yet — and since CI installs
them with a frozen lockfile, the lockfiles could not be regenerated to match
either.

### Why you no longer tag by hand

The version bump lands **before** the tag, so the tagged commit _is_ what ships.
Before #1375 the bump happened inside the release runner and was pushed to `main`
only after publishing, which meant `git checkout vX.Y.Z` rebuilt the _previous_
version and no commit ever carried both the tag and the version it published.

Inverting that fixed the reproducibility hole and introduced a subtler one: the
new precondition lived in this document, while the action that had to satisfy it
— creating a Release in the GitHub UI — looked exactly as it always had. Both
v0.101.0 and v0.102.0 were tagged on plain `main` and refused by preflight. A
precondition a human must remember, in a different tool from the one that
enforces it, is a precondition that gets missed.

`release.yml` keeps the ordering guarantee and removes the remembering: the
commit it tags is one it just created, so the tag cannot name an unbumped tree.
Creating a Release by hand still works mechanically, and preflight will still
catch it — but you would be re-entering the trap the workflow exists to close.

Three details of that workflow are load-bearing and easy to undo by accident:

- It **dispatches** `publish.yml` rather than relying on the `release: published`
  event. GitHub does not start workflow runs from events created with the
  repository's `GITHUB_TOKEN`, so a Release published from CI triggers nothing —
  silently. `workflow_dispatch` is a documented exception to that rule. The
  dispatch targets the new tag, so `publish.yml` and everything it calls resolve
  `github.ref` to the tag exactly as the event path would.
- It **never rebases**. If `main` advanced mid-run the push is rejected and the
  release stops, because the changelog was generated from a range that no longer
  matches `main`. Re-dispatch; do not force it through.
- It holds `contents: write` and therefore deliberately withholds
  `id-token: write`. Publishing stays in `publish.yml`, whose publish job checks
  out with `persist-credentials: false` so build tooling can never reach a
  credential that writes to the repository. Keep those two capabilities in
  separate workflows.

### Letting release.yml push to main

The workflow pushes twice: the release commit to `main`, then the `vX.Y.Z` tag.
These answer to **different protections**: branch protection governs only the
commit push, while the tag push is governed solely by tag rulesets (if any
target `v*`), whose bypass is configured independently — so a run can land the
commit and still have its tag rejected, and the fix for one lives in a
different setting than the other. For the branch push, the fix depends on which
kind of protection rejected it — the push error names it:

- **`GH006: Protected branch update failed`** — a **classic** branch-protection
  rule (Settings → Branches). Add the **github-actions** app under that rule's
  "Allow specified actors to bypass required pull requests". Deploy keys cannot
  bypass classic protection, so with a classic rule in place the app bypass is
  the only automated-path option.
- **`GH013: Repository rule violations`** — a **ruleset** (Settings → Rules).
  Add a bypass for the **github-actions** app, or — if the Apps picker won't
  offer it — enable the ruleset's built-in **"Deploy keys"** bypass and give the
  workflow a key: create a write-access deploy key (Settings → Deploy keys),
  store its private half as the `RELEASE_DEPLOY_KEY` Actions secret, and the
  checkout in `release.yml` switches its pushes to that key over SSH. With the
  secret absent the checkout falls back to `GITHUB_TOKEN`, so configuring the
  key is opt-in.

Running both kinds of protection on `main` means satisfying both; consolidating
on a single ruleset keeps this one bypass list. And weigh the two bypasses
differently, because their blast radii differ. The **app bypass** exempts the
`GITHUB_TOKEN` of _every_ workflow that obtains `contents: write` — that is
`release.yml` and `doc-deploy.yml`'s gh-pages push, not the release path alone.
It is also why `doc-ci.yml` must stay on `contents: read`: that job executes
repository code from the pull request it verifies, so a write grant there plus
an app bypass would let any same-repo PR push straight to `main`. The **deploy
key** is narrower — only a job that reads the `RELEASE_DEPLOY_KEY` secret can
use it — but that secret is available to any workflow with secrets access, so
treat it with the same care as any other write credential.

v0.103.0's first dispatch hit exactly this: the run generated the release
commit, the push was rejected with GH006, and — because the push is the first
mutating step — nothing was left to clean up; after fixing the bypass,
re-dispatching the same version was all it took.

### Cutting one by hand

Only needed if `release.yml` cannot push to `main` and the bypass above cannot
be granted — the run reports the rejection explicitly.

1. `pnpm bumpVersion X.Y.Z && pnpm changelog X.Y.Z`
2. Open it as a PR titled `chore(release): X.Y.Z`, review the generated
   changelog, merge it.
3. Optional rehearsal: dispatch **Publish Packages on Release** with `version:
X.Y.Z` and `dry_run: true`. It preflights, builds and asks npm to validate
   every tarball, uploading nothing.
4. Create a GitHub Release with tag `vX.Y.Z`, targeting **the merged release
   commit** — not `main`, which may have moved.

Either way, `publish.yml` first runs a **preflight** asserting every manifest and
the changelog agree with the tag. It reads only the checkout, so it answers in
seconds and everything else depends on it — a tag that cannot ship is rejected
before the matrix starts, not after it. Then the full PR verification and the
full e2e matrix run against the tagged tree, and finally it publishes via OIDC
with provenance. It writes nothing back to the repository.

`publish.sh` publishes in **dependency (topological) order** — `core`/`dom-core`
before the drivers that pin them, computed by
[`scripts/publishOrder.js`](../scripts/publishOrder.js) — and **preflights** that
every package already exists on npm, aborting _before_ any publish (naming the
offender) if one is missing, so a forgotten bootstrap can't half-ship a release.
It is also idempotent: it skips any `name@version` already on the registry, so
re-running after a partial publish resumes instead of failing.

### If a release fails

Read the failed step first:
`gh run view <run-id> --repo atomic-testing/atomic-testing --log-failed`.

`release.yml` mutates shared state in exactly three steps, in this order: push
the commit, push the tag, dispatch the publish (the GitHub Release is created
last, so a failure never leaves a public announcement for a version nothing is
publishing). Which of them completed is what determines the recovery, and the
run's step list tells you directly.

| Failed at                            | State left behind                                                                                                                                                                                          | Recovery                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| ------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Anything **before** the push         | Nothing. Every earlier step is read-only, and the run replays `publish.yml`'s own preflight assertion against the generated commit, so a release that cannot ship stops while it is still free to abandon. | Fix the cause, dispatch again at the same version.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| **Pushed**, not tagged               | `main` carries `chore(release): X.Y.Z`; no tag, no Release, nothing on npm.                                                                                                                                | Dispatch again **at the same version**, provided `main` has not advanced past the release commit. `RELVER-03` reports `mode: resume` for an already-bumped tree with no tag, so the run skips the bump and goes straight to tagging — but it first checks `HEAD` is still that release commit, because later commits change neither the manifests nor the changelog heading and would slip past every other check while being absent from the notes. If `main` did advance, release X.Y.Z+1 instead, which regenerates the notes over the full range; otherwise do not bump, or you strand an orphan `## [X.Y.Z]` section for a version that never shipped. |
| **Tagged**, not dispatched           | Tag exists; no Release, nothing on npm.                                                                                                                                                                    | Start the publish by hand — the run only ever dispatches it once, and no event will: `gh workflow run publish.yml --ref refs/tags/vX.Y.Z -f version=X.Y.Z -f dry_run=false`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| **Dispatched**; `publish.yml` failed | Tag and Release exist; npm may be partially published.                                                                                                                                                     | Fix the cause and re-dispatch the same command. `publish.sh` is idempotent — it skips any `name@version` already on the registry, so a re-fire resumes rather than failing.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |

Re-cutting the _same_ version after its tag exists is refused by `RELVER-02`, on
purpose: the tag would then point at a different commit than the one it was
created for. If you genuinely need to abandon a version, delete both the tag and
its GitHub Release before dispatching again — and note that an abandoned tag can
no longer poison the next changelog's baseline, since `generateChangelog.js` now
skips any tag whose tree was never bumped to match it.

## Changelog generation

`CHANGELOG.md` is generated, not hand-written — by
[`scripts/generateChangelog.js`](../scripts/generateChangelog.js), which
`release.yml` runs against the commit it is about to tag (`pnpm changelog X.Y.Z`
is the same thing by hand). It is generated **before** the release rather than
committed after the fact, so what ships and what the changelog claims shipped are
the same commit. Dispatch the Release workflow with **preview** ticked to read
the generated section before anything is pushed.

The script walks commit subjects since the previous release tag. It finds that
tag by looking for the version being released among the `v*` tags: run before
the tag exists (the normal path now) the newest tag is the previous release;
run after it exists (a re-fire) the newest tag is this release and the previous
one is next. Subjects are sorted into sections by their `type` prefix:

| Type           | Section          |
| -------------- | ---------------- |
| `feat`         | Features         |
| `fix`          | Fixes            |
| `perf`         | Performance      |
| `refactor`     | Refactoring      |
| `docs`         | Documentation    |
| `build`        | Build & Tooling  |
| `!` (any type) | Breaking Changes |

`chore`, `style`, and `test` commits are intentionally excluded from every
section — they're real history, just not release-notes material. See
[`CONTRIBUTING.md`](../CONTRIBUTING.md) for the authoring-side convention
(commit/PR title format) that this depends on.

**Fixing a bad entry:**

- Before it's committed: re-run `node scripts/generateChangelog.js <version> --since <tag>`
  locally to regenerate the section, then hand-edit `CHANGELOG.md` before the
  release finishes (or push a follow-up commit).
- After it's committed: amend `CHANGELOG.md` directly in a normal follow-up commit —
  there's no need to regenerate the whole file, since only the newest section
  needs fixing.

## Standalone lockfiles move with the consumer bump

`bumpVersion` rewrites **manifests only**, and splits them in two:
`pnpm bumpVersion X.Y.Z` touches the packages being published (the release PR),
while `pnpm bumpVersion X.Y.Z --consumers` floats the `examples/*` and `docs/`
specifiers that install those packages from npm (step 9, after they exist).

CI installs every one of those projects with a frozen lockfile, so the consumer
bump must regenerate the lockfiles in the same change — otherwise their jobs go
red on whatever unrelated PR happens to run next:

```bash
pnpm bumpVersion X.Y.Z --consumers
for dir in examples/*/; do (cd "$dir" && pnpm install --lockfile-only); done
(cd docs && pnpm install --lockfile-only --ignore-workspace)
```

**`--lockfile-only` patches in place — it does not always re-resolve peers.**
When a consumer's own third-party pin also needs bumping in the same change
(not just the `@atomic-testing/*` specifiers `bumpVersion` touches), pnpm can
keep an existing peer resolution that no longer satisfies the new peer's
range instead of re-resolving it, and `pnpm install` only warns rather than
failing. This bit `example-astryx-workspace`'s Astryx bump to 0.4.1 (#1467):
`--lockfile-only` kept `@stylexjs/stylex` pinned at `0.18.3`, which satisfied
Astryx 0.1.3's old `peerDependencies: '@stylexjs/stylex': '^0.18.3'` but not
0.4.x's `^0.19.0` — a silent unmet-peer warning, not a failed install, so
nothing red-flagged it. `rm pnpm-lock.yaml && pnpm install --lockfile-only`
forces the fresh resolution; reach for it whenever a third-party pin changes
alongside the consumer float, not just when a warning already showed up.

## Rotate `CODEMOD_TOKEN` (before it expires, ~yearly)

`CODEMOD_TOKEN` is a GitHub PAT with **Contents: Read and write**. Be precise
about which half of the release path holds a repo-write credential, because the
two are deliberately different:

- **`publish.yml` holds none.** It declares `permissions: {}`, its publish job
  takes `contents: read` plus `id-token: write`, and it checks out with
  `persist-credentials: false` — so the build tooling that runs beside the npm
  publishing identity cannot reach anything that writes to the repository.
- **`release.yml` deliberately does.** It takes `contents: write` to push the
  release commit and tag, and `actions: write` to start the publish — and just as
  deliberately withholds `id-token: write`. Keeping those two capabilities in
  separate workflows is the point.

`release.yml` uses the built-in `GITHUB_TOKEN` for that, not this PAT. The PAT is
the standard remedy if branch protection on `main` has no bypass for the GitHub
Actions actor and the push step fails — see [Cutting one by hand](#cutting-one-by-hand)
for the alternative. Kept here regardless, because a stale secret is worth
retiring deliberately rather than by neglect.

1. Create a fine-grained PAT: owner `atomic-testing`, repo `atomic-testing`,
   **Contents: Read and write**. Set an expiry **and a calendar reminder**.
2. `gh secret set CODEMOD_TOKEN --repo atomic-testing/atomic-testing`

## Add a new package

A **`private: true`** package needs no bootstrap and no trusted publisher — the
preflight and publish loop both skip it (it only builds). The steps below apply to
a new **published** package.

npm can't attach a trusted publisher before a package exists, so a new package's
first publish can't use OIDC. Bootstrap it once, **before** the first release that
includes it — otherwise `publish.sh`'s preflight aborts the whole release (cleanly,
naming the un-bootstrapped package) rather than half-publishing it:

1. On a clean checkout of `main` containing the new package: `pnpm install`
2. `npm login` (npm CLI ≥ 11.10.0; account 2FA enabled)
3. `./bootstrap-new-package.sh <package-folder-name>` — publishes a `0.0.0`
   placeholder and configures the trusted publisher. Enter your 2FA OTP when
   prompted (at the publish and `npm trust` steps).
4. Confirm the new `package.json` has a `repository` field (provenance requires it).
5. Verify: `npm view @atomic-testing/<name> version` → `0.0.0`.

`setup-trusted-publishers.sh` reconciles trusted publishers for all published
packages (auto-discovers them); re-run anytime — it's idempotent.

## Gotchas

- **No `NPM_TOKEN`** — auth is OIDC; the workflow needs `id-token: write`.
- **npm ≥ 11.5.1** is required for OIDC; the workflow installs an exactly pinned
  npm (`NPM_VERSION` in publish.yml), never `latest`
  (`pnpm publish` shells out to npm). Stay on **pnpm 10** — pnpm 11 has an OIDC regression.
- **Provenance** is automatic; every `package.json` needs a `repository.url`
  matching the repo or publish fails `E422`.
- **Frozen packages** (MUI 5 / MUI-X 5, [ADR-005](adr/005-drop-mui-5-support.md))
  are excluded from both `publish.sh` and the docs TypeDoc entry points in
  `docs/docusaurus.config.ts` — keep those two exclude lists in sync.
