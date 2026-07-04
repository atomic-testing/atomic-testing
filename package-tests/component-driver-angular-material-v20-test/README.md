# @atomic-testing/component-driver-angular-material-v20-test

Examples and tests for `@atomic-testing/component-driver-angular-material-v20`,
using the shared three-file suite pattern:

| File pattern    | Purpose                                                              |
| --------------- | -------------------------------------------------------------------- |
| `*.suite.ts`    | Framework-agnostic test definitions (`ScenePart` + assertions)       |
| `*.dom.test.ts` | Vitest browser-mode adapter (bootstraps through `AngularInteractor`) |
| `*.e2e.test.ts` | Playwright adapter (drives the served example app)                   |

## DOM side: Vitest browser mode, zone + zoneless

Unlike the React driver test packages (Jest + jsdom), the DOM side runs in a
**real browser** (Vitest browser mode on Playwright chromium): ADR-013 rejected
jsdom for Angular fixtures, and Angular Material's overlays lean on the native
Popover API that jsdom lacks (jsdom/jsdom#3721). Each suite runs twice — once
with zone.js loaded and once zoneless (`createTestEngine` detects the absence
of zone.js and bootstraps with `provideZonelessChangeDetection()`), mirroring
`package-tests/angular-20-test`.

The Angular `createTestEngine` is async, so the `.dom.test.ts` adapters pass an
async `getTestEngine` — `useTestEngine` awaits it before the first test runs.

## Example app (e2e)

The Vite app in `src/` is JIT-compiled at runtime (`src/main.ts` loads
`@angular/compiler`; Angular Material's partial-Ivy declarations link through
it as well), so no Angular build plugin is needed. `src/directory.ts` maps each
suite's `url` to the standalone component that renders it. The Playwright
config auto-starts/stops the dev server (port 5220).

## Run

```bash
# Build the workspace deps first — tests resolve @atomic-testing/* to dist
# (stale-dist trap)
pnpm --filter "@atomic-testing/component-driver-angular-material-v20-test..." build

pnpm test:dom            # Vitest browser mode (zone + zoneless projects)
pnpm test:e2e            # Playwright on chromium, firefox and webkit
pnpm test:e2e:chrome     # Chromium only (faster iteration)
```

The `playwright` devDependency is pinned (`~1.56.1`) to the chromium revision
preinstalled in the dev container — see `package-tests/angular-20-test`'s
README for the full rationale. It only affects Vitest browser mode; the e2e
suites resolve `@playwright/test` from the workspace root.
