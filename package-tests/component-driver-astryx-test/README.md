# @atomic-testing/component-driver-astryx-test

Examples and tests for [`@atomic-testing/component-driver-astryx`](../../packages/component-driver-astryx) — a Vite example app plus the shared `.suite.ts` / `.dom.test.ts` / `.e2e.test.ts` pattern run against real Astryx (`@astryxdesign/core`) components.

```bash
pnpm start                 # Vite dev server on http://localhost:3020
pnpm test:dom              # Jest (jsdom)
pnpm test:e2e              # Playwright (chromium/firefox/webkit; auto-starts the dev server)
pnpm test:e2e:chrome       # Playwright (chromium only)
```
