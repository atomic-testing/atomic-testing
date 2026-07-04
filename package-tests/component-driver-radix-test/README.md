# @atomic-testing/component-driver-radix-test

Examples and tests for [`@atomic-testing/component-driver-radix-v1`](../../packages/component-driver-radix-v1) — a Vite example app plus the shared `.suite.ts` / `.dom.test.ts` / `.e2e.test.ts` pattern run against real Radix (`radix-ui`) primitives.

```bash
pnpm start                 # Vite dev server on http://localhost:3030
pnpm test:dom              # Jest (jsdom)
pnpm test:e2e              # Playwright (chromium/firefox/webkit; auto-starts the dev server)
pnpm test:e2e:chrome       # Playwright (chromium only)
```

The examples without a test suite (slider, scroll-area, tabs, context-menu, dialog, dropdown-menu, popover, tooltip) are the Wave 0 capability-gap-audit scenes: they render the raw Radix DOM the downstream driver waves anchor against. See `agent-docs/modules/component-driver-radix.md` for the audit findings and the portal recipe.
