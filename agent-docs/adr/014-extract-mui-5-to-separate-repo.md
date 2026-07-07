# ADR-014: Extract MUI 5 / MUI-X 5 to a separate repo

## Status

Accepted (2026-07-07).

## Context

[ADR-005](005-drop-mui-5-support.md) ended support for MUI 5 / MUI-X 5 by
**freezing them in place**: the packages stayed in this repo, excluded from
publishing and the CI test matrix, specifically to avoid breaking the
still-live references to them (the docs site, `agent-docs` reference docs,
several package READMEs, and `typedoc.json`) without a migration pass. That
migration pass was explicitly deferred.

Keeping a frozen, no-longer-worked-on package in the same repo as actively
maintained ones has a cost of its own: it's dead weight in `pnpm install`,
`pnpm -r` scripts, and anyone browsing `packages/`, and it invites accidental
edits to code nobody intends to change.

## Decision

`component-driver-mui-v5` and `component-driver-mui-x-v5` (plus their
`package-tests/*` suites) are extracted, with full commit history, to
[atomic-testing/component-driver-mui-v5](https://github.com/atomic-testing/component-driver-mui-v5)
and removed from this repo entirely.

- The docs/example migration ADR-005 deferred was done first, so this repo
  has no remaining functional references to the removed packages: docs site
  pages, package READMEs, `agent-docs` reference docs, `typedoc.json`,
  `publish.sh`'s and `setup-trusted-publishers.sh`'s exclude lists,
  `.github/dependabot.yml`, and `.vscode/tasks.json` were all updated or
  trimmed.
- The new repo is a standalone pnpm workspace: the two driver packages'
  `workspace:*` dependencies on `@atomic-testing/core` and
  `-component-driver-html` became pinned npm semver ranges; `mui-x-v5`'s
  dependency on `mui-v5` stays `workspace:*` since both now live together.
  `check:type` was restored for both (removed under ADR-005 because building
  only `mui-v5`'s `dist` — not `mui-x-v5`'s — left its cross-package type
  import unresolved; the new repo builds both, so this no longer applies).
- The `package-tests/*` suites moved along for historical reference but do
  **not** run standalone there: they depend on `@atomic-testing/internal-test-runner`
  and sibling `internal-*` packages that are private to this monorepo and
  were never published to npm.
- `@atomic-testing/component-driver-mui-v5@0.81.0` and
  `component-driver-mui-x-v5@0.81.0` remain installable from npm, unchanged —
  this is a repo-location change only, not a package change.

## Consequences

- ✅ This repo's `packages/` and `package-tests/` contain only actively
  maintained code; no frozen packages sit alongside them.
- ✅ Full git history is preserved for anyone who needs to trace v5-era
  driver behavior or the picker drivers that were never carried forward.
- ✅ npm consumers see no change: same package names, same `0.81.0`.
- ⚠️ The extracted repo's `package-tests/*` are reference-only, not
  buildable/runnable — a smaller scope than a from-scratch mirror of the full
  monorepo's test infrastructure would give.
- ⚠️ Two repos now share the `0.81.0` release history for these packages;
  future readers must know to look in the new repo, not this one. READMEs and
  docs link to it, but a stale bookmark to the old in-repo path will 404.

## Alternatives considered

| Alternative                                | Why not chosen                                                                                    |
| ------------------------------------------ | ------------------------------------------------------------------------------------------------- |
| Keep frozen in place (status quo, ADR-005) | Was the right first step, but leaves permanently-dead packages in the actively maintained repo    |
| Delete outright, no extraction             | Discards installable-package source history and the only record of the v5-only picker drivers     |
| Extract without preserving git history     | Cheaper, but loses blame/history for anyone debugging a v5-era regression or reviving the pickers |

## Related

- [ADR-005](005-drop-mui-5-support.md) — the freeze-in-place decision this supersedes for repo location (not for npm support status).
- [ADR-003](003-version-specific-packages.md) — the version-per-package pattern this repo continues to follow for v6/v7+.
