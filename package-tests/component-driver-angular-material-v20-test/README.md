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

The `playwright` devDependency matches the workspace-root `@playwright/test`
pin so the e2e CLI and the adapter's import share one instance (two copies of
@playwright/test in a process hard-error). In sandboxed dev environments
without browser downloads, point `CHROMIUM_EXECUTABLE` at a preinstalled
Chromium (both the Vitest browser provider and the e2e chromium project honor
it — mirroring `package-tests/storybook-test`); CI and normal dev machines
install browsers through Playwright's registry instead.
