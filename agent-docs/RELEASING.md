# Releasing

How `@atomic-testing/*` packages reach npm. Publishing runs in CI on GitHub
**release publish** via [`publish.yml`](../.github/workflows/publish.yml), which
builds and publishes every non-excluded, **non-`private`** package through
[`publish.sh`](../publish.sh) using **npm Trusted Publishing (OIDC)** — no
long-lived npm token. Packages marked `"private": true` (the `internal-*` test
tooling, example harness, and MUI-X fixture) are still **built** — the repo's own
tests consume their `dist` — but are never published.

## Cut a release

**Actions → [Release](../.github/workflows/release.yml) → Run workflow → enter
`X.Y.Z`.** That is the whole thing. Do not create the GitHub Release by hand —
see [Why you no longer tag by hand](#why-you-no-longer-tag-by-hand).

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

### Cutting one by hand

Only needed if `release.yml` cannot push to `main` — branch protection without a
bypass for the GitHub Actions actor, which the run reports explicitly.

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

1. Read the failed step: `gh run view <run-id> --repo atomic-testing/atomic-testing --log-failed`
2. If `release.yml` failed **before** the push, nothing happened — fix the cause
   and dispatch it again. Everything it does before pushing is read-only, and it
   runs `publish.yml`'s own preflight assertion against the generated commit
   first, precisely so a release that cannot ship stops while it is still free to
   abandon.
3. If it failed **after** the tag existed, the tag and Release are real. Delete
   both, then dispatch again at the next version — re-cutting the same version
   would point an existing tag at a new commit, which `RELVER-02` refuses.
4. If some packages already published, `publish.sh` is idempotent, so a re-fire
   at the same version resumes rather than failing. If you prefer, bump to the
   next patch instead.

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

## Rotate `CODEMOD_TOKEN` (before it expires, ~yearly)

`CODEMOD_TOKEN` is a GitHub PAT that the release path **no longer uses**: the
workflow writes nothing back to the repository, so it holds no repo-write
credential at all. Kept here for any other workflow that still needs one, and
because a stale secret is worth retiring deliberately rather than by neglect.

1. Create a fine-grained PAT: owner `atomic-testing`, repo `atomic-testing`,
   **Contents: Read and write**. Set an expiry **and a calendar reminder**.
2. `gh secret set CODEMOD_TOKEN --repo atomic-testing/atomic-testing`
3. Re-fire the failed release (see above).

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
