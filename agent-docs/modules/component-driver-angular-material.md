# Module group: component-driver-angular-material

Covers `component-driver-angular-material-v20` / `-v21` / `-v22` — drivers for
[Angular Material](https://material.angular.dev) components, one package per
Material major (ADR-003 model, like the MUI drivers). Phase 1 of #1024
scaffolded the packages with a smoke `ButtonDriver`; the driver surface grows
in later phases (#1026–#1028).

## Package shape

Mirrors `component-driver-mui-v7`:

- `@angular/material` + `@angular/cdk` are **compatibility-declaration
  `dependencies`** with zero runtime imports — drivers are DOM/ARIA-contract
  based (mui precedent: `@mui/material` is a dependency never imported).
- `@atomic-testing/core`, `dom-core`, `component-driver-html`, and the
  matching `@atomic-testing/angular-2x` adapter are `workspace:*` deps.
- tsdown build, `check:type` via tsgo, standard exports map.

## Drivers

| Driver         | Anchors on                                                                                                          | File (v20; v21/v22 are per-major copies)                                                               |
| -------------- | ------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| `ButtonDriver` | native `<button>`/`<a>` host of `matButton`; `disabled` or `aria-disabled="true"` (`disabledInteractive`) for state | [ButtonDriver.ts](../../packages/component-driver-angular-material-v20/src/components/ButtonDriver.ts) |

**Locator rule:** anchor on ARIA roles/attributes or forwarded `data-testid`,
never on `.mat-mdc-*` classes — Angular documents them as unstable.

## Test packages (`package-tests/component-driver-angular-material-*-test`)

Three-file suite pattern (`*.suite.ts` + `*.dom.test.ts` + `*.e2e.test.ts`)
with an Angular twist on the DOM side:

- **DOM = Vitest browser mode through `AngularInteractor`** (not Jest+jsdom):
  ADR-013 rejected jsdom for Angular, and Material overlays lean on the native
  Popover API jsdom lacks (jsdom/jsdom#3721). Each suite runs twice — zone.js
  and zoneless projects (setup files toggle the import).
- The `.dom.test.ts` adapters pass the **async** Angular `createTestEngine`
  straight to `testRunner`; `GetTestEngine` accepts promises since #1025.
- **E2E = Playwright** against a Vite app (`src/main.ts`) that is JIT-compiled
  at runtime (`@angular/compiler` loaded; Material's partial-Ivy declarations
  runtime-link through it — no Angular build plugin). `src/directory.ts` maps
  suite `url`s to standalone components. The Playwright config auto-starts the
  dev server (ports 5220/5221/5222 for v20/v21/v22).

### Workspace gotchas (will cost an hour each)

- **Angular dedupe:** `angular-core`'s dist resolves its own devDependency
  copy of `@angular/*` (Angular 20); a v21/v22 test package therefore loads
  two Angular copies and dies with NG0203 unless its vitest config sets
  `resolve.dedupe` for `@angular/*`/`rxjs`/`zone.js` (the React-dedupe
  problem, Angular edition).
- **One `@playwright/test` instance:** the local `playwright` devDependency
  must match the workspace-root `@playwright/test` pin, or the e2e CLI and the
  adapter's import load two copies and Playwright hard-errors on
  `test.describe()`.
- **Prebuilt theme CSS** is exported only under the `style` condition — import
  it by direct file path (`../node_modules/@angular/material/prebuilt-themes/…`),
  not the bare specifier.
- **`CHROMIUM_EXECUTABLE`** points both the Vitest browser provider and the
  e2e chromium project at a preinstalled Chromium in sandboxed dev
  environments (mirrors `storybook-test`).

## Related

- [ADR-013](../adr/013-angular-shared-core-thin-packages.md) — Angular adapter layering; async `createTestEngine`.
- [modules/framework-adapters.md](framework-adapters.md) — `AngularInteractor` settling.
- [modules/component-driver-mui.md](component-driver-mui.md) — the package-shape precedent.
