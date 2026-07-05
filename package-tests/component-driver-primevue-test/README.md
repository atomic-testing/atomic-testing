# component-driver-primevue-test

Examples and shared test suites for `@atomic-testing/component-driver-primevue-v4` — and the repo's first Playwright e2e coverage for Vue (`package-tests/vue-3-test` is jsdom-only).

## Layout

The package follows the repo's three-file shared-test pattern (see the root `CLAUDE.md`):

- `src/examples/<component>/<Component>.examples.ts` — the rendered Vue example, written as `defineComponent` + `h()` render functions (no SFCs, so Jest needs no Vue compiler transform).
- `src/examples/<component>/<Component>.suite.ts` — `ScenePart` + framework-agnostic `TestSuiteInfo`.
- `__tests__/<Name>Driver.dom.test.ts` / `.e2e.test.ts` — the Jest (jsdom via `@atomic-testing/vue-3`) and Playwright adapters.

`src/directory.ts` maps each suite's e2e `url` to the example component; `src/App.ts` renders the entry matching `location.pathname`. `src/primevueSetup.ts` is the single PrimeVue plugin/theme bootstrap shared by the browser app and the jsdom engine (`src/createPrimeVueTestEngine.ts`) so both render identical DOM.

## Running

```bash
pnpm test:dom          # Jest (jsdom)
pnpm test:e2e          # Playwright, all three browsers (auto-starts Vite on port 3040)
pnpm test:e2e:chrome   # Chromium only, faster iteration
```

The Playwright config auto-starts/stops the Vite dev server (the `component-driver-astryx-test` variant rather than the manual-start one): a Vue app has no extra server-side setup that would need a manually prepared server, and auto-start keeps `pnpm test:e2e` a single self-contained command locally and in CI.

Rebuild `packages/component-driver-primevue-v4` (and `core`/`vue-3` when touched) before trusting a test run — both runners resolve `@atomic-testing/*` to built `dist` (stale-`dist` trap, root `CLAUDE.md`).

## Jest specifics

- PrimeVue 4 ships ESM-only `.mjs`, so `jest.config.js` transforms `.js`/`.mjs` and exempts `primevue`/`@primevue`/`@primeuix` from `transformIgnorePatterns`.
- `testEnvironmentOptions.customExportConditions: ['node', 'node-addons']` — jsdom's default `browser` condition would resolve `@vue/test-utils` to its browser UMD (which expects a global `Vue`).
- `jest.setup.ts` holds jsdom-only polyfills PrimeVue needs (same precedent as `component-driver-radix-test/jest.setup.ts`).
