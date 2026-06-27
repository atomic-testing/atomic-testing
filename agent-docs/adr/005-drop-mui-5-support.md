# ADR-005: End of support for MUI 5 and MUI-X 5

## Status

Accepted (2026-06-27).

## Context

[ADR-003](003-version-specific-packages.md) established one driver package per
MUI major because each major ships a distinct rendered DOM. The trade-off it
named is real: `mui-v5`/`-v6`/`-v7` are ~95% identical, so every cross-cutting
fix or new driver must be replicated across every maintained major. As v6/v7
(and MUI-X v6/v7/v8) became the versions under active development, continuing to
carry v5 cost maintenance effort and CI time for a major that new work no longer
targets.

Additional v5-specific drag at the time of this decision:

- The v5 (and v6) Playwright e2e harness was blocked by a Vite 8 / Rolldown
  dep-optimizer defect specific to the MUI 5/6 prebundle shape (tracked in
  #877; the purely-v5 instance was #886), so v5 had no working cross-browser
  e2e path.
- The v5 driver checklist (#23) still had open navigation components, all of
  which are also tracked for v6/v7 in newer issues.

The MUI-X picker caveat: `component-driver-mui-x-v5` is the **only** MUI-X
package that ships date/time **picker** drivers (v6–v8 are DataGrid-only). That
coverage was never carried forward and is not reintroduced by this decision.

## Decision

**MUI 5 and MUI-X 5 are no longer supported, effective 2026-06-27.** Support is
ended by deprecation in place rather than deletion:

- `packages/component-driver-mui-v5` and `packages/component-driver-mui-x-v5`
  remain in the repo, frozen at `0.81.0`. Each carries a `deprecated` field in
  `package.json` and a warning banner in its README.
- They are excluded from `publish.sh` (so the release pipeline no longer
  republishes them) — they are **not** marked deprecated on the npm registry, so
  the already-published `0.81.0` keeps installing silently.
- Their test packages (`package-tests/component-driver-mui-v5-test`,
  `…-mui-x-v5-test`) remain but are removed from the CI test matrix
  (`.github/workflows/buildui.yml`); their suites no longer run.
- New work (drivers, fixes, state accessors) targets v6/v7, and v8 for MUI-X.
- The `examples/example-mui-signup-form` example and the documentation site were
  intentionally left referencing v5 for now; migrating them is deferred.

## Consequences

- ✅ Smaller maintained surface: cross-cutting MUI work replicates across v6/v7
  instead of v5/v6/v7.
- ✅ Faster CI (two fewer test-matrix legs) and no more wasted publishes.
- ✅ No breakage for existing consumers — `0.81.0` stays installable from npm.
- ⚠️ The MUI-X date/time picker drivers (v5-only) now have no supported home.
- ⚠️ Docs, the signup-form example, and several package READMEs still import
  `mui-v5` and will need a follow-up migration pass.
- ⚠️ "Frozen in repo, not deprecated on npm" means the only deprecation signal a
  consumer sees is the `package.json` `deprecated` field and the README — not an
  `npm install` warning.

## Issue disposition

- **Closed as purely v5** (wontfix): #886 (v5 e2e harness), #23 (v5 driver
  checklist).
- **Narrowed to the supported majors** (v5 dropped from scope): #880–#885
  (driver enhancements), #73 (Slider), #877 (e2e blocker → v6 only).
- **Re-scoped to v6/v7**: #86 (Rating fractional `setValue`), #68 (Rating reset
  to no star) — the Rating driver is shared across majors, and #878 already
  tracks the underlying coordinate-free primitive.
- **Unchanged**: #878 (core Interactor primitives) — version-agnostic; its v5
  references are now moot but the work stands.

## Alternatives considered

| Alternative | Why not chosen |
|-------------|----------------|
| Delete the v5 packages and tests outright | Would break the example app and docs immediately and discard installable history; reversible deprecation chosen instead |
| `npm deprecate` the published packages | Out of scope for this pass — kept to repo/docs signals only to avoid surfacing install-time warnings now |
| Keep v5 on full support | The maintenance/CI cost no longer matched its usage; new work targets v6/v7 |
