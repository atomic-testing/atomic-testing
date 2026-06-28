# Module: component-driver-astryx (`@atomic-testing/component-driver-astryx`)

## Purpose

Drivers for [Astryx](https://github.com/facebook/astryx) components (published on npm under the `@astryxdesign/*` scope). Astryx styles components with StyleX, whose class names are build-time hashed and therefore **not stable test anchors**; Astryx is ARIA-role-first, so drivers anchor on **`data-testid`, `role`, and accessible name — never StyleX classes**. The package mirrors the layout of the MUI driver packages and depends only on `@atomic-testing/core` and `@atomic-testing/component-driver-html`.

## Public surface

Barrel: [component-driver-astryx/src/index.ts](../../packages/component-driver-astryx/src/index.ts).

| Export                | Kind   | Notes                                                                 |
| --------------------- | ------ | --------------------------------------------------------------------- |
| `ButtonDriver`        | driver | Astryx `Button`; extends `HTMLButtonDriver`.                          |
| `AstryxDriverError`   | error  | Base error (`extends ErrorBase`); currently unthrown (see Non-goals). |
| `AstryxDriverErrorId` | const  | Stable `name` id for `AstryxDriverError`.                             |

## Dependency shape

- `@astryxdesign/core` is a **peerDependency pinned `^0.1.1`** ([package.json](../../packages/component-driver-astryx/package.json)) — consumers supply Astryx; it is not bundled. Caret on a `0.x` locks the `0.1` minor (`>=0.1.1 <0.2.0`). `@astryxdesign/core` is **ESM-only** and **peer-requires React ≥19**, so consumers test with `@atomic-testing/react-19`.
- Regular deps: `@atomic-testing/core`, `@atomic-testing/component-driver-html` (both `workspace:*`). The driver code imports nothing from `@astryxdesign/core` — it is a DOM driver, so the Astryx component is only present at the consumer's render site.

## How it works — `ButtonDriver`

Astryx `Button` renders a native `<button>` (an `<a>` only when `href` is set), shows the `label` prop as **visible text**, and forwards unknown props (`data-testid`, `role`, `aria-label`) onto the root. `ButtonDriver` ([ButtonDriver.ts](../../packages/component-driver-astryx/src/components/ButtonDriver.ts)) `extends HTMLButtonDriver` (inheriting `click`) and adds two reads:

- `getLabel()` → the verbatim `aria-label` attribute when present, otherwise the visible text. This is a deliberate stopgap, **not** the full accessible-name algorithm (`aria-labelledby` / associated `<label>` resolution is out of scope).
- `isDisabled()` (override) → true when the native `disabled` attribute is present **or** `aria-disabled="true"`. Astryx uses native `disabled` normally but switches to `aria-disabled` when a `tooltip` is set (to keep the button focusable).

## Locating Astryx buttons

The driver is locator-agnostic; the scene supplies the locator. Two stable strategies:

- **`byDataTestId(...)`** — the idiomatic handle; Astryx forwards `data-testid` onto the native element.
- **`byRole('button', { name })`** — the name-aware overload resolves to the CSS selector `[role="button"][aria-label="<name>"]`. A native `<button>` carries its role _implicitly_ and takes its name from _text_, so this selector only matches when the element sets `role="button"` **and** `aria-label` explicitly (Astryx forwards both). Use it to disambiguate two same-role buttons by their verbatim `aria-label`; it does not resolve text/computed names.

## Non-goals

- No StyleX-class-based locators.
- `AstryxDriverError` exists as the package's error-module foundation but is not yet thrown by any driver — it is exported public surface awaiting a driver with a typed error path.

## Testing this package

The harness lives at [package-tests/component-driver-astryx-test](../../package-tests/component-driver-astryx-test) (mirrors `component-driver-html-test`): a Vite example app, jest (jsdom) adapters, and Playwright (chromium/firefox/webkit), proven via the three-file Button suite.

**Critical jsdom/jest detail:** because `@astryxdesign/core` is ESM-only and the shared `jest.config.base.js` does not transform `node_modules`, the test package's [jest.config.js](../../package-tests/component-driver-astryx-test/jest.config.js) adds a `'^.+\.(js|mjs)$': '@swc/jest'` transform rule **and** `transformIgnorePatterns: ['/node_modules/(?!.*(?:@astryxdesign|@stylexjs))']` (the `.*` lookahead is pnpm-real-path safe). With this, the real Astryx component renders under jsdom — no component mock is needed; only CSS imports are mocked. Prefer the subpath import `@astryxdesign/core/Button` (smaller transform surface than the barrel).

The Vite app ([vite.config.ts](../../package-tests/component-driver-astryx-test/vite.config.ts)) runs on **strictPort 3020** with `resolve.dedupe: ['react','react-dom']`. The `<Theme>` provider + Astryx CSS imports live at the browser app shell only ([src/index.tsx](../../package-tests/component-driver-astryx-test/src/index.tsx)); the shared example renders bare components so the jsdom path stays minimal.

## Extension points — add an Astryx driver

1. Create `src/components/XDriver.ts`, extending the relevant `component-driver-html` base (or `ComponentDriver`).
2. Locate by `data-testid` / `role` + accessible name; never StyleX classes.
3. Export from [index.ts](../../packages/component-driver-astryx/src/index.ts); add a matching example + three-file suite under the test harness.

## Related files

- [modules/component-driver-html.md](component-driver-html.md) — the base drivers + canonical driver pattern.
- [modules/core.md](core.md) — `ComponentDriver`, `byRole`/`byDataTestId`, `ErrorBase`.
- [adr/001-component-driver-pattern.md](../adr/001-component-driver-pattern.md) — the pattern's rationale.
