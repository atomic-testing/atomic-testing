# Module: component-driver-astryx (`@atomic-testing/component-driver-astryx`)

## Purpose

Drivers for [Astryx](https://github.com/facebook/astryx) components (published on npm under the `@astryxdesign/*` scope). Astryx styles components with StyleX, whose class names are build-time hashed and therefore **not stable test anchors**; Astryx is ARIA-role-first, so drivers anchor on **`data-testid`, `role`, and accessible name — never StyleX classes**. The package mirrors the layout of the MUI driver packages and depends only on `@atomic-testing/core` and `@atomic-testing/component-driver-html`.

## Public surface

Barrel: [component-driver-astryx/src/index.ts](../../packages/component-driver-astryx/src/index.ts) — the canonical, authoritative export list. Drivers are grouped by leverage tier:

- **Buttons, inputs, toggles (Wave 1):** `Button`, `IconButton`, `ToggleButton`, `ButtonGroup`, `ToggleButtonGroup`, `Link`, `TextInput`, `TextArea`, `NumberInput`, `TimeInput`, `CheckboxInput`, `RadioList`, `CheckboxList`, `Switch`, `SegmentedControl`, `SelectableCard`, `Slider`, `Field`, `InputGroup`, `FieldStatus`, `Banner`, `Pagination`, `Collapsible` drivers, plus the shared `AstryxFieldInputDriver` base.
- **Overlays & menus (Wave 2):** `NavMenuDriver`, `ToolbarDriver`, `ToastDriver`, `TabListDriver` (+ `TabDriver`), `DropdownMenuDriver`, `MoreMenuDriver` (extends DropdownMenu), `PopoverDriver`, `DialogDriver`, `AlertDialogDriver`, plus the shared `AstryxMenuDriver` base and `MenuItemDriver`.

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
- **`byRole('button')` composed with `byAriaLabel('<name>', 'Same')`** (via `locatorUtil.append`) — there is no name-aware `byRole` overload; the name filter is the separate `byAriaLabel` locator compounded onto the same element (relative `'Same'`), resolving to `[role="button"][aria-label="<name>"]`. A native `<button>` carries its role _implicitly_ and takes its name from _text_, so this only matches when the element sets `role="button"` **and** `aria-label` explicitly (Astryx forwards both). It disambiguates two same-role buttons by their verbatim `aria-label`; it does not resolve text/computed names (the accname-correct `findByRole` is deferred — see #923).

## Overlays & menus (Wave 2)

Astryx overlays are **not portalled** — `DropdownMenu`/`MoreMenu`/`Popover` render their panel as an inline _sibling_ of the trigger via the native HTML Popover API (`usePopover`→`useLayer`, content always mounted), and `Dialog`/`AlertDialog` are native `<dialog>` elements opened with `showModal()`. So no MUI-style `overriddenParentLocator()` is needed. Two patterns carry the family:

- **`aria-controls` panel resolution** ([DropdownMenuDriver.ts](../../packages/component-driver-astryx/src/components/DropdownMenuDriver.ts), [PopoverDriver.ts](../../packages/component-driver-astryx/src/components/PopoverDriver.ts)): the driver anchors on the trigger (`data-testid`, `aria-expanded`, `aria-controls`) and resolves the panel at runtime by reading `aria-controls` and re-rooting to `[id="<that>"]` — instance-safe, mirroring `AstryxFieldInputDriver`'s a11y-link reads. `isOpen` reads the trigger's `aria-expanded` (React-state-driven, faithful in jsdom).
- **Positional child iteration** ([internal/childListHelper.ts](../../packages/component-driver-astryx/src/internal/childListHelper.ts)): the menu/tab families have mixed-tag items (`NavMenu` renders `<a>`/`<div>`) or items interspersed with non-items (separators; the `TabList` overflow trigger), which break the core `listHelper`'s tag-aware `:nth-of-type`. `childListHelper` walks `:nth-child` over the container's children using only `Interactor.exists` (the only portable element count — `getAttribute(..., true)` length differs: Playwright drops null entries, jsdom keeps them). `AstryxMenuDriver` is the shared base for the three menu drivers; `MenuItemDriver`/`TabDriver` are the item drivers.

Conditional/derived reads, not hard-coded roles: `Toast.getType` reads `data-type` (its `role` flips `alert`↔`status` by severity); `Dialog.getRole` returns `'alertdialog'` only for `purpose="required"`; `TabList` active tab is `aria-current="page"` (no `role="tab"`), and its label is read from the visible span (Astryx duplicates the label in an `aria-hidden` width "sizer").

**E2E-only / WebKit-gated.** Native-popover open/close visibility is not modelled in jsdom (reads still work — content is mounted), so it is covered by the Playwright run. Playwright's **WebKit** cannot drive these interactions: opening a native-popover overlay busies WebKit's main thread (subsequent automation times out) and Escape on the animating modal `<dialog>` never reaches a stable press target. The 6 open/close _interaction_ tests are therefore skipped on WebKit via [src/webkitGate.ts](../../package-tests/component-driver-astryx-test/src/webkitGate.ts) (`useBrowserName` + `skipInteractionOnWebkit`); all reads run on chromium/firefox/webkit, full interactions on chromium/firefox.

## Non-goals

- No StyleX-class-based locators (the `astryx-*` semantic classes are a documented last resort, e.g. `Toast`'s `.astryx-toast`, used only where a component emits neither a `data-testid` nor a stable role).
- No portal-escape recipe for overlays — Astryx renders them in-tree (see Overlays & menus).

## Testing this package

The harness lives at [package-tests/component-driver-astryx-test](../../package-tests/component-driver-astryx-test) (mirrors `component-driver-html-test`): a Vite example app, jest (jsdom) adapters, and Playwright (chromium/firefox/webkit), proven via the three-file Button suite.

**Critical jsdom/jest detail:** because `@astryxdesign/core` is ESM-only and the shared `jest.config.base.js` does not transform `node_modules`, the test package's [jest.config.js](../../package-tests/component-driver-astryx-test/jest.config.js) adds a `'^.+\.(js|mjs)$': '@swc/jest'` transform rule **and** `transformIgnorePatterns: ['/node_modules/(?!.*(?:@astryxdesign|@stylexjs))']` (the `.*` lookahead is pnpm-real-path safe). With this, the real Astryx component renders under jsdom — no component mock is needed; only CSS imports are mocked. Prefer the subpath import `@astryxdesign/core/Button` (smaller transform surface than the barrel).

**jsdom web-platform shims** ([jest.setup.ts](../../package-tests/component-driver-astryx-test/jest.setup.ts), wired via `setupFiles`): jsdom lacks several APIs Astryx overlays use. The setup polyfills the **Popover API** (`showPopover`/`hidePopover`/`togglePopover` as no-ops), the native **`<dialog>` modal methods** (`show`/`showModal`/`close`, reflected onto the `open` attribute the driver reads — `showModal` otherwise throws and tears down the dialog subtree), **`window.matchMedia`** (Toast → `useTheme`), and **`window.scrollTo`** (Dialog scroll-lock). True overlay visibility/animation is not modelled — that is the Playwright run's job.

The Vite app ([vite.config.ts](../../package-tests/component-driver-astryx-test/vite.config.ts)) runs on **strictPort 3020** with `resolve.dedupe: ['react','react-dom']`. The `<Theme>` provider + Astryx CSS imports live at the browser app shell only ([src/index.tsx](../../package-tests/component-driver-astryx-test/src/index.tsx)); the shared example renders bare components so the jsdom path stays minimal.

## Extension points — add an Astryx driver

1. Create `src/components/XDriver.ts`, extending the relevant `component-driver-html` base (or `ComponentDriver`).
2. Locate by `data-testid` / `role` + accessible name; never StyleX classes.
3. Export from [index.ts](../../packages/component-driver-astryx/src/index.ts); add a matching example + three-file suite under the test harness.

## Related files

- [modules/component-driver-html.md](component-driver-html.md) — the base drivers + canonical driver pattern.
- [modules/core.md](core.md) — `ComponentDriver`, `byRole`/`byDataTestId`, `ErrorBase`.
- [adr/001-component-driver-pattern.md](../adr/001-component-driver-pattern.md) — the pattern's rationale.
