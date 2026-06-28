# Releasing

How `@atomic-testing/*` packages reach npm. Publishing runs in CI on GitHub
**release publish** via [`publish.yml`](../.github/workflows/publish.yml), which
builds and publishes every non-excluded package through [`publish.sh`](../publish.sh)
using **npm Trusted Publishing (OIDC)** — no long-lived npm token.

## Cut a release

1. Make sure `main` is green and has what you want to ship.
2. Create a GitHub Release with tag `vX.Y.Z` (e.g. `v0.85.0`), targeting `main`.
3. The publish workflow runs automatically: sets versions, publishes via OIDC
   (with provenance), and commits the version bump back to `main`.
4. Verify: `npm view @atomic-testing/core version` → `X.Y.Z`.

`publish.sh` is idempotent — it skips any `name@version` already on the registry,
so re-running after a partial publish resumes instead of failing.

### If a release fails

1. Read the failed step: `gh run view <run-id> --repo atomic-testing/atomic-testing --log-failed`
2. Fix forward on `main`, then re-fire: delete + recreate the release tag from
   current `main` (a plain re-run reuses the old tag's workflow).
3. If some packages already published, idempotency covers the re-fire at the same
   version. If you prefer, bump to the next patch instead.

## Rotate `CODEMOD_TOKEN` (before it expires, ~yearly)

`CODEMOD_TOKEN` is the GitHub PAT used for checkout + the version commit-back.
On expiry, releases fail at **checkout** with the cryptic
`fatal: could not read Username for 'https://github.com': terminal prompts disabled`.

1. Create a fine-grained PAT: owner `atomic-testing`, repo `atomic-testing`,
   **Contents: Read and write**. Set an expiry **and a calendar reminder**.
2. `gh secret set CODEMOD_TOKEN --repo atomic-testing/atomic-testing`
3. Re-fire the failed release (see above).

## Add a new package

npm can't attach a trusted publisher before a package exists, so a new package's
first publish can't use OIDC. Bootstrap it once, **before** the first release that
includes it:

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
- **npm ≥ 11.5.1** is required for OIDC; the workflow installs `npm@latest`
  (`pnpm publish` shells out to npm). Stay on **pnpm 10** — pnpm 11 has an OIDC regression.
- **Provenance** is automatic; every `package.json` needs a `repository.url`
  matching the repo or publish fails `E422`.
- **Frozen packages** (MUI 5 / MUI-X 5, [ADR-005](adr/005-drop-mui-5-support.md))
  are excluded from both `publish.sh` and the docs TypeDoc entry points in
  `docs/docusaurus.config.ts` — keep those two exclude lists in sync.
