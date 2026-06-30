# ADR-009: Split versioning — frozen core group vs. independent drivers

## Status

Accepted (2026-06-29). Part of the 1.0 freeze. Decision **D3** of the core gap audit (issue #964).

## Context

Every package was published lockstep at `0.88.0`: `bumpVersion <ver>` rewrote
**all** package versions to the same value, and `publish.sh` (via `pnpm publish`)
rewrites `workspace:*` deps to exact pins at publish time. Lockstep ties the
**stable core's** SemVer guarantee to the **fast-moving drivers** — a one-line
`component-driver-mui-x` patch would bump the core's version, and a core release
would renumber every driver. Once the core is frozen at 1.0, its version number
must mean something specific about the frozen surface, which lockstep prevents.

## Decision

**Split the version lines** (option (a)):

- The **frozen core group** — the nine packages of
  [ADR-006](006-1.0-api-freeze-and-evolution.md) (`core`, `dom-core`,
  `react-core`, `react-18`, `react-19`, `react-legacy`, `vue-3`, `playwright`,
  `component-driver-html`) — versions **in lockstep** at 1.0+ under SemVer against
  the frozen surface.
- The published **drivers** (`component-driver-mui-*`, `component-driver-mui-x-*`,
  `component-driver-astryx`) version **independently**, each on its own cadence,
  governed by the per-major support policy ([ADR-003](003-version-specific-packages.md),
  [ADR-005](005-drop-mui-5-support.md)) rather than the core 1.0 contract.

### How the tooling reflects it

- `bumpVersion <ver>` bumps **only the core group** (drivers are skipped).
- `bumpVersion <ver> <folder>` bumps **one** package, for releasing a single
  driver on its own cadence (a mistyped folder fails loudly).
- `publish.sh` needs no version logic: it publishes each package at the version in
  its own `package.json` and skips versions already on npm — so a core release
  leaves unchanged drivers alone (already-published → skipped), and a driver
  release does not disturb the core. `publishOrder.js` is version-agnostic
  (topological only) and is unchanged.
- The release workflow's tag-driven `bumpVersion $VERSION` now releases the core
  group; per-driver releases are a separate invocation.

### Dependency pins (follow-up note)

Drivers depend on core via `workspace:*`, pinned **exact** at publish, so a driver
published today pins the exact core version it was built against. If a driver
should accept future core **minors** without republishing, switch its core
dependency to `workspace:^` (caret). That is a refinement, not required by the
split, and is left as follow-up.

## Consequences

- ✅ The 1.0 core version means what it says — SemVer against the frozen surface,
  decoupled from driver churn. Drivers iterate without renumbering the core.
- ⚠️ The release process is now two-track: core releases via `v<X>` tags; driver
  releases are independent. CI automation for per-driver release tags is follow-up
  work; the scripts already support the manual path today.

## Alternatives considered

| Alternative                  | Why not chosen                                                                                                                |
| ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| Keep lockstep versioning (b) | Any driver change bumps the whole graph including the frozen core, so the core's SemVer number would no longer mean anything. |

## Related

- [ADR-006](006-1.0-api-freeze-and-evolution.md) — defines the frozen core group this versions together.
- [ADR-003](003-version-specific-packages.md), [ADR-005](005-drop-mui-5-support.md) — the per-major driver support policy that governs the independent lines.
- Issue #964.
