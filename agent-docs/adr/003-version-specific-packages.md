# ADR-003: Version-specific packages for React and MUI

## Status

Accepted (describes the existing design).

> **Update (2026-06-27):** MUI 5 and MUI-X 5 reached end of support — the
> `mui-v5` / `mui-x-v5` packages are frozen and deprecated in place. See
> [ADR-005](005-drop-mui-5-support.md). Mentions of v5 below describe the
> original design, not the currently supported set (v6/v7; v8 for MUI-X).

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
- ⚠️ **Code duplication**: mui-v5/v6/v7 are ~95% identical; a cross-cutting fix or new driver must be replicated across version packages. `react-18` and `react-19` are implementation-identical.
- ⚠️ Cross-package coupling exists where a driver package depends on a specific adapter (`mui-v7` → `react-18`; `mui-x-v8` → `mui-v6`) — see [ARCHITECTURE.md dependency graph](../ARCHITECTURE.md#package-dependency-graph).

## Alternatives considered

| Alternative | Why not chosen |
|-------------|----------------|
| Single package + runtime version detection | Branchy, fragile selector logic; ships dead code for unused majors |
| Single package + peer-dep range spanning majors | Cannot encode per-major DOM/role/class differences |
| Codegen one source → version variants | Added build complexity; not adopted (variants are maintained directly) |

## Related

- [modules/framework-adapters.md](../modules/framework-adapters.md), [modules/component-driver-mui.md](../modules/component-driver-mui.md), [modules/component-driver-mui-x.md](../modules/component-driver-mui-x.md).
