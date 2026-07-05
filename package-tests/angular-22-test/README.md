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

This is a sibling of `angular-20-test` pinned to Angular 22 instead — see that
package's README for the full rationale (why Vitest browser mode instead of
Jest/jsdom or a Playwright e2e page). The fixture code itself is identical;
only the pinned `@angular/*`/`@atomic-testing/angular-22` versions differ.

## Run

```bash
# Build the adapter first — tests resolve @atomic-testing/* to dist (stale-dist trap)
pnpm --filter "@atomic-testing/angular-22..." build

pnpm test:browser
```
