# Module: component-driver-radix (`@atomic-testing/component-driver-radix-v1` + `@atomic-testing/component-driver-shadcn-v1`)

## Purpose

Drivers for [Radix UI](https://www.radix-ui.com/primitives) primitives, targeting the **unified [`radix-ui`](https://www.npmjs.com/package/radix-ui) package** (peer `^1.0.0`), not the per-primitive `@radix-ui/react-*` packages (which render identical DOM — the unified package re-exports them). Radix primitives are unstyled; consumers style them with arbitrary (usually Tailwind) classes, so class names are **never test anchors**. The stable anchors, in priority order:

1. **`role` + accessible name** — Radix renders correct ARIA on every part.
2. **`data-slot`** — the shadcn/ui convention naming each part.
3. **Radix state attributes** — `data-state` (`open`/`closed`, `active`/`inactive`, `checked`/`unchecked`, `visible`/`hidden`), `data-orientation`, `data-disabled`, `data-side`, `data-align`, `data-highlighted`.
4. Never Tailwind/shadcn utility classes.

Radix also generates ids like `radix-_r_0_` at render time — **never hardcode them**; they are render-order-dependent. Resolve id links (`aria-controls`, `aria-labelledby`, `aria-describedby`, `label[for]`) with `byLinkedElement` instead.

`@atomic-testing/component-driver-shadcn-v1` is a **pure re-export shim** of `component-driver-radix-v1` ([shadcn-v1/src/index.ts](../../packages/component-driver-shadcn-v1/src/index.ts)): shadcn/ui components are styled Radix primitives, so the drivers are the same classes. Because the shim re-exports (never redeclares), each driver has a single class identity and `instanceof` agrees across both package names (verified against both built CJS bundles; the usual dual-package ESM/CJS hazard applies repo-wide, not to the shim specifically). The shim tracks radix-v1's major version in lockstep and declares no own drivers — add drivers only to radix-v1.

## Public surface

Barrel: [component-driver-radix-v1/src/index.ts](../../packages/component-driver-radix-v1/src/index.ts) — the canonical export list. Wave 0 ships the proof-of-life `SeparatorDriver` (`getOrientation` via `data-orientation`; `isDecorative` via `role="none"`); driver waves 1–5 extend it. Errors follow the mui-v7 `src/errors/<Name>Error.ts` pattern when a driver first needs one.

## Test harness

[package-tests/component-driver-radix-test](../../package-tests/component-driver-radix-test) mirrors `component-driver-astryx-test`: a Vite example app on **strictPort 3030** with `resolve.dedupe: ['react','react-dom']`, jsdom (jest) + Playwright (chromium/firefox/webkit, dev server auto-started by `playwright.config.ts`), proven via the three-file Separator suite. No app-shell provider is needed (Radix is unstyled); `Tooltip.Provider` lives inside the tooltip example.

**Critical jsdom/jest detail:** `radix-ui` ships ESM jest cannot parse untransformed, so the harness [jest.config.js](../../package-tests/component-driver-radix-test/jest.config.js) adds `'^.+\.(js|mjs)$': '@swc/jest'` to `transform` **and**

```js
transformIgnorePatterns: ['/node_modules/(?!.*(?:radix-ui|@radix-ui|@floating-ui|aria-hidden|react-remove-scroll))'],
```

(the `.*` lookahead is pnpm-real-path safe — same shape Astryx needed for StyleX). No jsdom polyfills were needed for the Wave 0 scene; overlay-heavy waves should expect to add a `jest.setup.ts` for `ResizeObserver`/`matchMedia`/`PointerEvent` gaps as Astryx did, guided by actual failures, not preemptively.

The audit scenes (slider, scroll-area, tabs, context-menu, dialog, dropdown-menu, popover, tooltip, select) render raw Radix DOM with inline sizing only; they are registered in [directory.tsx](../../package-tests/component-driver-radix-test/src/directory.tsx) and are the starting point for the driver waves' examples.

## The portal recipe for Radix overlays

Radix portals (`Dialog.Portal`, `DropdownMenu.Portal`, `Popover.Portal`, `Tooltip.Portal`, `ContextMenu.Portal`, `Select.Portal`) mount their content as **direct children of `document.body`** — unlike MUI there is **no shared `role="presentation"` wrapper**, and unlike Astryx the content is **not** an in-tree sibling of the trigger (do not reuse Astryx's in-tree dialog/menu driver shape). The MUI re-root recipe still applies verbatim (see the [portals & overlays guide](../../docs/docs/guides/portal-and-overlays.md) and `component-driver-mui-v7`'s `DialogDriver`/`MenuDriver`/`OverlayDriver`): override the two static hooks on the driver so child lookups re-root at the portalled surface —

```ts
static override overriddenParentLocator(): Optional<PartLocator> {
  return byRole('dialog', 'Root'); // the portalled surface, searched from the document root
}
static override overrideLocatorRelativePosition(): Optional<LocatorRelativePosition> {
  return 'Same'; // parts match AT the re-rooted scope, not as a nested descendant
}
```

Per-primitive re-root anchors, from rendered `radix-ui@1.6.1` DOM (chromium):

| Primitive                  | Portalled node under `<body>`                                                                                                                                                    | Re-root anchor                                                                                                                                                | Open/closed signal                                                                                       |
| -------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| Dialog                     | overlay `<div data-state>` and content `<div role="dialog">` are EACH direct body children                                                                                       | `byRole('dialog', 'Root')`                                                                                                                                    | content mounts on open (default `forceMount` off); trigger `aria-expanded`/`data-state` always present   |
| DropdownMenu / ContextMenu | `div[data-radix-popper-content-wrapper]` wrapping content `<div role="menu" data-state="open">`                                                                                  | `byRole('menu', 'Root')`                                                                                                                                      | trigger `data-state` (`aria-expanded` on DropdownMenu; ContextMenu's span trigger has `data-state` only) |
| Popover                    | `div[data-radix-popper-content-wrapper]` wrapping content `<div role="dialog" data-state="open">`                                                                                | `byRole('dialog', 'Root')` — **collides with an open modal Dialog**; disambiguate via the trigger's `aria-controls` link (below) or a forwarded `data-testid` | trigger `aria-haspopup="dialog"` + `aria-expanded`/`data-state`                                          |
| Tooltip                    | `div[data-radix-popper-content-wrapper]` wrapping a **role-less** positioned `<div data-state="delayed-open">`; the `role="tooltip"` element is a visually-hidden inner `<span>` | forwarded `data-testid` on `Tooltip.Content` (rendered on the outer div), or the trigger's `aria-describedby` → `byLinkedElement` for text reads              | trigger `data-state` (`closed`/`delayed-open`/`instant-open`)                                            |
| Select                     | content `<div role="listbox" data-state="open">` (direct body child)                                                                                                             | `byRole('listbox', 'Root')`                                                                                                                                   | trigger `role="combobox"` + `aria-expanded`/`data-state`                                                 |

Two portable refinements, both proven by existing drivers:

- **Instance-safe scoping (stacked overlays):** when the open trigger carries `aria-controls` (Dialog, DropdownMenu, Popover, Select — added only while open), re-root via the a11y link instead of the generic role — `byLinkedElement('Root').onLinkedElement(triggerLocator).extractAttribute('aria-controls').toMatchMyAttribute('id')` — mirroring Astryx's `DropdownMenuDriver` panel resolution. This never collides across simultaneous overlays.
- **Modal side effects:** while a modal Dialog is open, Radix sets `aria-hidden="true"` + `pointer-events: none` on `#root` (and renders `data-radix-focus-guard` spans) — clicks on in-page parts are intercepted until the dialog closes. Menus/menu items are `<div role="menuitem">` with `data-disabled`/`aria-disabled`, interspersed with `role="separator"` — positional iteration should use core `childListHelper` (mixed/nested children), as the Astryx menu family does.

jsdom coverage follows the [portals & overlays guide](../../docs/docs/guides/portal-and-overlays.md) table: Radix overlays are plain `createPortal` + popper positioning (no native Popover API), so open/close state and portalled structure render faithfully under jsdom; only geometry/visibility assertions are E2E-only.

## Wave 0 capability-gap audit (Interactor sufficiency)

Verified against rendered `radix-ui@1.6.1` DOM in chromium (audit scenes above). **No new `Interactor` primitives are needed** for Slider/ScrollArea/Tabs/ContextMenu:

- **Slider** — thumb is `<span role="slider" tabindex="0">` with `aria-valuenow/min/max`; there is **no `<input type="range">` in the DOM** (Radix renders a hidden bubble input only inside a `<form>`, and it is non-interactive), so `Interactor.setRangeValue` is **inapplicable** to Radix sliders. The portable write path is keyboard on the thumb — `pressKey` `ArrowRight`/`ArrowLeft`/`Home`/`End` (verified: 30 → 35 with `step={5}`) — and `drag(locator, delta)` works for pointer-driven moves (verified: 30 → 65 for +60px on a 200px track; E2E-only per the jsdom-geometry policy).
- **ScrollArea** — the viewport is a real `overflow: scroll` div (`data-radix-scroll-area-viewport`); `scrollBy` (hover + wheel; verified scrollTop 0 → 200) and `scrollIntoView` (verified) both work. Scrollbar/thumb expose `data-state="visible|hidden"` + `data-orientation`. E2E-only for scroll behavior, as already documented on the primitives.
- **Tabs** — plain `click` + attribute reads: triggers are `<button role="tab">` with `aria-selected`, `data-state="active|inactive"`, `data-disabled`+`disabled`; panels are `role="tabpanel"` with `hidden`, linked both ways by `aria-controls`/`aria-labelledby` (→ `byLinkedElement`).
- **ContextMenu** — `contextMenu(locator)` (right-click) opens it (verified); content is portalled `role="menu"` (recipe above); trigger flips `data-state` `closed`→`open`.

`MODIFIER_KEYS`, `FILE_UPLOAD`, and `getBoundingRect` were not exercised by these four but carry over unchanged; nothing in the rendered DOM suggests a gap.

## The #923 decision (accname-correct `findByRole`) — NOT pulled into Wave 0

Recorded evidence: the Radix `Select.Trigger` renders `role="combobox"` with **neither `aria-label` nor `aria-labelledby`** — its accessible name is fully computed (associated `label[for]` + rendered value text), and Select items name themselves via `aria-labelledby` → an inner text `<span>`. The `byAriaLabel` stopgap therefore **cannot** anchor a Radix Select by role + name, exactly as #923 anticipated.

Decision: **do not pull #923 forward**; proceed with Wave 0–5 without it, because no driver wave is blocked:

1. Radix forwards `data-testid` (and all `aria-*`/`data-*` props) onto every part, so scenes anchor triggers by `data-testid` — the harness's idiomatic handle — and never need name-based location for the component root.
2. "Select the item named X" does not need accname resolution: items are enumerable (`role="option"` / `role="menuitem"`, `data-radix-collection-item`) and matched by `getText`, the exact mechanism `MenuDriver.getMenuItemByLabel` (MUI) and the Astryx option-list drivers already use.
3. Id-ref chains (`aria-labelledby`, `aria-controls`, `label[for]`) are CSS-expressible via `byLinkedElement` — computed-name _reads_ (e.g. `getLabel()` on a Select) resolve the label element through the link and read its text, no accname algorithm required.
4. #923 introduces a second, non-CSS resolution channel on the `Interactor` interface — design-first and human-reviewed per [ADR 0001](../../docs/adr/0001-interactor-primitives-and-name-aware-role.md) Decision B; making it a Wave 0 gate would stall every driver wave behind an interface review for a capability none of them strictly needs.

Re-evaluate when a consumer scene must locate a Radix widget by role + computed name (rather than `data-testid`) — most plausibly at Wave 3 (Select/Combobox); that is #923's own scope, not this epic's.

## Extension points — add a Radix driver

1. Create `src/components/<Name>Driver.ts` in `component-driver-radix-v1`, extending the relevant `component-driver-html` base (or `ComponentDriver`/`ContainerDriver`). Portalled overlays override the two re-root hooks per the recipe above.
2. Locate by `role`/`data-slot`/Radix state attributes; never utility classes; never hardcoded `radix-*` ids.
3. Export from [index.ts](../../packages/component-driver-radix-v1/src/index.ts) (the shadcn shim re-exports automatically); add an example + three-file suite under the test harness, registered in `directory.tsx`.

## Related files

- [modules/component-driver-astryx.md](component-driver-astryx.md) — the harness/ESM-transform precedent (StyleX ↔ radix-ui).
- [modules/component-driver-mui.md](component-driver-mui.md) — the portal re-root reference implementations.
- [modules/core.md](core.md) — `ComponentDriver`, locators, `byLinkedElement`, `childListHelper`.
- [../../docs/adr/0001-interactor-primitives-and-name-aware-role.md](../../docs/adr/0001-interactor-primitives-and-name-aware-role.md) — the primitive set this audit validated; Decision B is #923.
