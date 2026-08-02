# ADR-003: Version-specific packages for React and MUI

## Status

Accepted (describes the existing design).

> **Update (2026-06-27):** MUI 5 and MUI-X 5 reached end of support — the
> `mui-v5` / `mui-x-v5` packages are frozen and deprecated in place. See
> [ADR-005](005-drop-mui-5-support.md). Mentions of v5 below describe the
> original design, not the currently supported set (v6/v7; v8 for MUI-X).
>
> **Update (2026-07-07):** `mui-v5` and `mui-x-v5` were extracted, with full
> history, to [atomic-testing/component-driver-mui-v5](https://github.com/atomic-testing/component-driver-mui-v5)
> and removed from this repo. See [ADR-014](014-extract-mui-5-to-separate-repo.md).

> **Update (2026-07-03, #1014):** `react-18` and `react-19` are no longer
> copies — `createTestEngine`/`createRenderedTestEngine` (and the deprecated
> `IReactTestEngineOption` alias) now live in `react-core`, and each version
> package is a thin re-export whose only remaining job is pinning its
> `react`/`react-dom` peerDependency range. A cross-cutting fix in `react-core`
> requires no changes to either version package. The duplication caveat under
> Consequences now applies to the MUI packages only.
>
> **Update (2026-08-02):** `component-driver-mui-v7` and `component-driver-mui-v9`
> each carried a hard `dependencies` pin on `@atomic-testing/react-18` — leftover
> from copying an earlier version package's manifest, never imported by either
> driver's own `src/` (both are pure DOM/role/class matchers; the framework
> binding is the *consumer's* choice of engine, not the driver's). `@mui/material`
> itself declares one identical peer range across v6/v7/v9
> (`^17.0.0 || ^18.0.0 || ^19.0.0`) — there was never a version-specific reason
> for either package to force React 18 on every consumer, and doing so produced
> real "unmet peer dependency" conflicts for any consumer actually on React 19
> (react-18's own peer is `react >=18.0.0 <19.0.0`). Both hard dependencies were
> removed; the "Cross-package coupling" consequence below no longer applies to
> `mui-v7 → react-18`. A new CI check (DEP-PIN-02 in
> `scripts/check-dependency-pinning.mjs`) now fails the build if a
> `component-driver-*` package hard-depends on an `@atomic-testing/react-N` /
> `vue-N` / `angular-N` engine package whose major doesn't match its own —
> Angular Material's `component-driver-angular-material-vNN → angular-NN`
> pairing is the one legitimate case, because Angular Material's major *is* the
> Angular major it requires; MUI's major is an independent axis from React's,
> so no such pairing is ever legitimate there.
>
> **Guidance for new version-specific packages:** don't copy a sibling
> package's `dependencies`/`peerDependencies` verbatim. Check the actual
> peerDependencies of the third-party library the new package wraps (its
> published `package.json`) to find the framework-major range it really
> supports, and declare that — don't assume it matches whatever an existing
> sibling package happened to declare. Only add a hard dependency on one
> specific `@atomic-testing/react-N`/`vue-N`/`angular-N` engine package if the
> wrapped design system's major is genuinely locked to that one framework
> major (Angular Material); otherwise leave the framework as an open
> peerDependencies floor and let the consumer's own engine choice satisfy it.

## Context

Two dependencies make breaking changes across major versions in ways that affect this library:

- **React** changes its render/unmount API (React ≤17 `ReactDOM.render`; React 18+ `createRoot`) and which module exports `act`.
- **MUI** changes rendered DOM: class names, ARIA roles (e.g. Select's trigger role changed from `button` to `combobox` at 5.12, noted in [SelectDriver.ts#L29](../../packages/component-driver-mui-v7/src/components/SelectDriver.ts#L29)), and nesting.

A single package trying to support all majors would need runtime branching on framework version and would couple consumers to versions they don't use.

## Decision

Ship one package per major version:

- React adapters: `react-legacy` (≤17), `react-18`, `react-19` ([createTestEngine variants](../ARCHITECTURE.md#createtestengine-variants--what-actually-differs)).
- MUI-core drivers: `component-driver-mui-v5` / `-v6` / `-v7`.
- MUI-X drivers: `component-driver-mui-x-v5` … `-v8`.

Consumers install the package matching their framework major; each pins the appropriate peer range.

## Consequences

- ✅ No runtime version branching; selectors/APIs are correct for one major.
- ✅ Consumers pull only the version they use.
- ✅ A MUI-major DOM change is fixed in one package without risk to others.
- ⚠️ **Code duplication**: mui-v5/v6/v7 are ~95% identical; a cross-cutting fix or new driver must be replicated across version packages. `react-18` and `react-19` were originally duplicated copies; since #1014 they are thin re-exports of `react-core`'s implementation (see the 2026-07-03 update above).
- ⚠️ Cross-package coupling exists where a driver package depends on another driver package for shared implementation (`mui-x-v8` → `mui-v6`) — see [ARCHITECTURE.md dependency graph](../ARCHITECTURE.md#package-dependency-graph). This is different from a driver hard-depending on a specific framework-engine package (`mui-v7` → `react-18`, removed 2026-08-02 per the update above) — that pairing named an arbitrary framework major, not a real requirement.

## Alternatives considered

| Alternative                                     | Why not chosen                                                         |
| ----------------------------------------------- | ---------------------------------------------------------------------- |
| Single package + runtime version detection      | Branchy, fragile selector logic; ships dead code for unused majors     |
| Single package + peer-dep range spanning majors | Cannot encode per-major DOM/role/class differences                     |
| Codegen one source → version variants           | Added build complexity; not adopted (variants are maintained directly) |

## Related

- [modules/framework-adapters.md](../modules/framework-adapters.md), [modules/component-driver-mui.md](../modules/component-driver-mui.md), [modules/component-driver-mui-x.md](../modules/component-driver-mui-x.md).
