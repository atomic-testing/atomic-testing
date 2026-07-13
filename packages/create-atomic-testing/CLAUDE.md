# create-atomic-testing/CLAUDE.md

The onboarding scaffolder — `npm/pnpm/yarn create atomic-testing`. It detects a
project's stack and writes a working, green example test. This note covers the
things a change here must keep in sync; the root [`CLAUDE.md`](../../CLAUDE.md)
covers the monorepo.

## The registry is the extension point

A recipe is **composed**, not hard-coded: a framework, a runner and a design
system are three independent plugins, and a compatibility matrix decides which
combinations are offered and at what tier. Everything routes through
[`src/registry/`](src/registry/):

- **Add a design system** (e.g. a new `component-driver-*`) → a `DesignSystemPlugin`
  in `designSystems.ts` (its `driverPackage(major)` names the driver package).
- **Add a framework / a new major** (e.g. Svelte, or React 20) → a `FrameworkPlugin`
  in `frameworks.ts` (its `enginePackage(major)` names the engine package).
- **Offer a combination** → one `CompatRule` row in `compatibility.ts` with a
  support tier and an `enabled` flag. The registered-but-disabled `angular + jest`
  row is the worked example of the seam. No resolution code changes.

**One registration, two surfaces.** The docs **Framework & Runner Support** matrix
is generated from this same registry (`docs/scripts/genSupportMatrix.mjs` imports
the built `dist`), so registering a plugin here makes it appear in the published
matrix automatically — you do not edit the matrix by hand.

## Invariants the CI gates enforce (build `dist` first — the checks read it)

- **`check:recipes`** (`scripts/check-recipe-sync.mjs`, REC-SYNC-\*) — every
  `@atomic-testing/*` a recipe emits exists, and its version + peer ranges match
  the real workspace manifests.
- **`check:coverage`** (`scripts/check-scaffolder-coverage.mjs`, COV-\*) — every
  shipped `component-driver-*` package is reachable through a design-system plugin
  (or on the script's small allow-list), and every engine/driver the registry
  emits is a real package. This is what turns "forgot to register the new driver"
  into a red build instead of a silent omission.

Both import the built `dist/index.mjs`, so run `pnpm --filter create-atomic-testing
build` before them (CI does this in the `create-atomic-testing-test` job).

## Versions are derived, not hand-maintained

`ATOMIC_VERSION` in [`src/constants.ts`](src/constants.ts) is read from this
package's own `package.json`, which the release process bumps in lockstep across
every `@atomic-testing/*` package. **Do not** re-introduce a hard-coded version
literal: a `[skip ci]` release bump once updated the manifests but not such a
literal, and REC-SYNC only caught it on the next unrelated PR. Third-party ranges
(`THIRD_PARTY`) are still hand-maintained here and guarded by REC-SYNC.

## Purity boundary

`detect/`, `registry/`, `generate/` and `plan/` are pure (no fs); `io/` and
`apply/` are the only side-effecting seams. Keep new logic on the pure side so it
stays unit-testable and `--dry-run` stays cheap.
