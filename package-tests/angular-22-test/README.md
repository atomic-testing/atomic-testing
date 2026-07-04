# @atomic-testing/angular-22-test

Validation fixture for `@atomic-testing/angular-22` (and therefore
`@atomic-testing/angular-core`, which holds the implementation).

It drives a real standalone Angular component — signals, `OnPush`, JIT inline
template — through the component driver pattern in a **real browser** (Vitest
browser mode on Playwright chromium), twice:

- **`zone` project** — zone.js is loaded in the setup file; `createTestEngine`
  bootstraps zone-based.
- **`zoneless` project** — zone.js is absent; `createTestEngine` detects that
  and bootstraps with `provideZonelessChangeDetection()`.

The same test file asserts the mode-specific settling semantics: a
`setTimeout`-driven update is already settled after `click()` under zone.js
(pending macrotask tracked by `whenStable()`), while zoneless requires the
polling fallback.

## Why Vitest browser mode instead of Jest (jsdom) or a Playwright e2e page

- The point of this fixture is to exercise **`AngularInteractor`'s settling**,
  which only runs in-process with the DOM. A Playwright e2e suite (like
  `component-driver-html-test`) would drive the page through
  `PlaywrightInteractor` and never touch the Angular interactor.
- Jest + jsdom + zone.js is the historically painful path
  (`jest-preset-angular`, zone polyfill ordering) and jsdom is not a real
  browser; Angular's own tooling has moved to Vitest.

## Run

```bash
# Build the adapter first — tests resolve @atomic-testing/* to dist (stale-dist trap)
pnpm --filter "@atomic-testing/angular-22..." build

pnpm test:browser
```

The `playwright` devDependency is pinned (`~1.56.1`) to the chromium revision
preinstalled in the dev container; bump it freely alongside a
`pnpm exec playwright install chromium` when newer browser downloads are
available. It is independent of the `@playwright/test` version the e2e suites
pin at the workspace root — this package never loads `@playwright/test`.
