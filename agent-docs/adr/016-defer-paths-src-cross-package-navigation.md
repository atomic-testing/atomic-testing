# ADR-016: Defer `paths→src` cross-package source navigation for the LSP

## Status

Accepted — **deferred** (2026-07-19). Keeps cross-package LSP resolution on the built
`.d.ts`. Records the context and the concrete options so a future revisit starts from
today's evidence rather than re-deriving it. See the **When to revisit** triggers below.

## Context

The repo drives Claude Code's code intelligence with `tsc --lsp` (TypeScript 7 native,
installed as `@typescript/native`; see the CLAUDE.md _Toolchain note_ and
[`tools/ts7-lsp/README.md`](../../tools/ts7-lsp/README.md)). Verified with the real LSP
tool against the workspace:

- **Within-package** go-to-definition lands in source — e.g. `getPartFromDefinition` →
  `packages/core/src/drivers/driverUtil.ts`. ✅
- **Cross-package** hover and `workspaceSymbol` resolve correctly (type signature + docs
  for an imported `@atomic-testing/*` symbol). ✅
- **Cross-package** go-to-definition returns **"No definition found."** ⚠️ The import
  resolves through the package's `exports` map to the bundled `dist/index.d.mts`, which
  the LSP treats as an external, un-indexed library.

Each package's `exports` point only at `dist/`, so cross-package navigation targets a
built, bundled declaration file rather than source. A TypeScript `paths` mapping fixes
the resolution:

```jsonc
// tsconfig.json compilerOptions — TS 7-compliant form (no baseUrl; relative targets)
"paths": { "@atomic-testing/*": ["./packages/*/src/index.ts"] }
```

**This works for the LSP** — verified via [`tools/ts7-lsp/verify-navigation.py`](../../tools/ts7-lsp/verify-navigation.py)
against a fresh `tsc --lsp` server: with the mapping, cross-package go-to-definition
resolves to `packages/core/src/drivers/ComponentDriver.ts` (source), not `dist`.

**But it cannot be scoped to the LSP.** The LSP server and `check:type` (`tsc --noEmit`)
discover the *same* per-file `tsconfig.json`. So the same `paths→src` mapping forces
`check:type` to compile cross-package **source**, which collides with the repo's
per-package emit model:

- `check:type` on a single consumer (`component-driver-html`) produced **60 errors** —
  `TS6059` ("File `…/core/src/index.ts` is not under 'rootDir'") and `TS6307` ("not
  listed within the file list of project"). Cross-package source is outside the
  consumer project's inferred `rootDir` and `include`.
- The enforcement is **not** only `composite`. Stripping `composite: true` from all 37
  package `tsconfig.json` files did **not** clear it — `declaration: true` + `outDir`
  (inherited from the root config) also require `rootDir` containment.
- The example workspaces and `packages/playwright/tsconfig.json` additionally declare
  project `references`, which assume the composite project boundaries.

In short: the mapping that gives the LSP source navigation simultaneously turns
`check:type` from "validate each package against its dependencies' `.d.ts` contracts"
into "recompile every dependency's source," and that fights the composite / declaration
/ rootDir project structure head-on.

## Decision

**Keep cross-package resolution on the built `.d.ts`.** Do not add `paths→src` now.

The gap is narrow — only cross-package _go-to-definition_ (and by extension
_find-references_) is affected; within-package navigation, cross-package hover, and
`workspaceSymbol` all work. The fixes (below) each cost far more than the gap: either a
~37-file config split with permanent per-package overhead, or a repo-wide change to
`check:type` semantics. Neither is justified by the present friction.

## Consequences

- ✅ Zero change; `check:type`, build (`.d.ts` via `@typescript/typescript6`), and the
  LSP stay exactly as shipped in the TS7/TS6 coexistence migration.
- ✅ The agent can still _read_ any cross-package type (hover) and _locate_ any symbol
  (`workspaceSymbol`); only the jump-to-source affordance is missing across packages.
- ⚠️ Cross-package go-to-definition / find-references return the bundled `.d.ts` or
  "external"; to read a dependency's source the agent falls back to `workspaceSymbol`
  or opening the file.
- ℹ️ Requires `dist` to be built for even the bundled-`.d.ts` cross-package result (the
  same stale-`dist` trap documented in the root `CLAUDE.md`).

## Options when this is revisited

Characterized with today's evidence. Options 1–2 were empirically reproduced this
session; options 3–4 are candidates whose feasibility is noted but **not** fully
validated — treat them as spikes, not proven paths.

### 1. Split configs — LSP config vs. `check:type` config _(empirically viable)_

Give each package **two** configs: `tsconfig.json` carries `paths→src` (the LSP
auto-discovers it → source navigation), and a new `tsconfig.check.json` overrides
`paths` back to `{}` so `check:type` resolves through `exports` to `dist` exactly as
today.

```jsonc
// packages/<pkg>/tsconfig.check.json
{ "extends": "./tsconfig.json", "compilerOptions": { "paths": {} } }
// packages/<pkg>/package.json
"check:type": "tsc --noEmit -p tsconfig.check.json"
```

- **Cost:** ~37 thin new configs + 37 `check:type` script edits + root `paths` addition
  + teach the scaffolder (`packages/create-atomic-testing`) to emit both configs for new
  packages.
- **Risk:** low — `check:type` semantics are unchanged; only the LSP config gains
  `paths`. The LSP tolerates `paths→src` even with `composite` set (it resolves, it does
  not run the emit-time `rootDir` check that blocks `check:type`).
- **Downside:** a permanent two-config-per-package convention and matching CI/scaffolder
  surface.

### 2. Dismantle the per-package emit model _(empirically characterized; highest risk)_

Add `paths→src` to the root config and remove `composite` / `declaration` / `outDir` so
`check:type` compiles source cleanly.

- **Cost:** one conceptual change, fewest new files.
- **Risk:** high — changes `check:type` semantics **repo-wide** (every package recompiles
  all dependency source: slower, and the whole source graph must be type-clean together).
  Needs full revalidation across every package **and** every per-major variant
  (`angular-2x`, `mui-x-vx`, …), which are separate CI jobs. Must also unwind the
  `references` in `playwright` and the example workspaces.
- **Bonus:** eliminates the stale-`dist` typecheck trap (typecheck reads source, not a
  possibly-stale `.d.ts`).

### 3. Declaration maps _(blocked today)_

Emit `.d.ts.map` alongside each `.d.mts` so go-to-definition follows the map back to
source — **no** `tsconfig`/`check:type` change at all, the cleanest shape if it worked.

- **Blocked because:** the `.d.ts` is produced by `tsdown` → `rolldown-plugin-dts`, which
  emits a **bundled** declaration and does not write a `.d.ts.map` (its `sourcemap`
  option covers the JS output only — a build emits `index.mjs.map` but no `index.d.mts.map`).
  Even if emitted, a bundled declaration has no clean 1:1 source mapping, and the Claude
  Code LSP tool exposes only `goToDefinition` (not `goToSourceDefinition`), so it is
  unclear the map would be followed.
- **Revisit if:** the `.d.ts` toolchain gains per-file declaration-map emission.

### 4. TypeScript project `references` _(natural fit; unvalidated)_

`composite: true` is **already** set on every package config, but no package declares
`references` to its workspace dependencies. Wiring real project references is the
canonical TS-monorepo mechanism: editors follow the _source-of-project-reference
redirect_ to a dependency's source `.ts` without a `paths` hack and without the
cross-project `rootDir` error (references are the sanctioned cross-project boundary).

- **Attraction:** uses machinery the repo half-configures already; source navigation as
  a designed feature rather than a resolution override.
- **Unknowns (not tested here):** builds use `tsdown`, not `tsc -b`, so references would
  be editor/LSP-only; per-major variants and build ordering need validation; whether the
  redirect fires for these `exports`-to-`dist` packages is unconfirmed. Worth a spike
  before committing.

## Alternatives considered

| Alternative | Why not chosen (now) |
| --- | --- |
| Add `paths→src` to the shared per-package configs | Breaks `check:type` (60 `TS6059`/`TS6307` errors); the LSP and `check:type` share the config, so it cannot be scoped to the LSP. |
| Split configs (option 1) | Viable, but ~37 new configs + permanent two-config-per-package overhead outweigh the narrow gap today. |
| Dismantle the emit model (option 2) | Repo-wide `check:type` semantic change with per-variant revalidation cost, disproportionate to the benefit. |
| Declaration maps (option 3) | Blocked by the bundled-`.d.ts` toolchain and the tool's lack of `goToSourceDefinition`. |

## When to revisit

- Cross-package go-to-definition / find-references becomes a repeated friction point for
  contributors or agents (the trigger this ADR anticipates).
- The driver packages adopt TypeScript project `references` (option 4 becomes cheap and
  natural — the `composite` groundwork is already laid).
- `tsdown` / `rolldown-plugin-dts` gains per-file declaration-map emission (option 3
  unblocks).
- The toolchain consolidates on a single TypeScript (e.g. TS 7.1 ships the programmatic
  compiler API and the build/docs tools move off `@typescript/typescript6`), which would
  restructure the configs anyway and is a good moment to fold in option 1 or 4.

## Related

- CLAUDE.md _Toolchain note_ and _Code intelligence (tsc LSP)_ — the coexistence setup
  and the LSP this ADR is about.
- [`tools/ts7-lsp/README.md`](../../tools/ts7-lsp/README.md) — the LSP plugin and its
  "Cross-package navigation" note (points here).
- [`tools/ts7-lsp/verify-navigation.py`](../../tools/ts7-lsp/verify-navigation.py) — the
  reproducible probe that demonstrated `paths→src` resolving cross-package to source.
