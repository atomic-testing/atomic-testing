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

Barrel: [component-driver-radix-v1/src/index.ts](../../packages/component-driver-radix-v1/src/index.ts) — the canonical export list. Wave 0 shipped the proof-of-life `SeparatorDriver` (`getOrientation` via `data-orientation`; `isDecorative` via `role="none"`). Wave 1 (#1003) adds `DialogDriver`, `DropdownMenuDriver`, `PopoverDriver`, `SelectDriver`, and a shared internal `MenuItemDriver` (mirrors `component-driver-mui-v7`'s reuse of one item driver across `MenuDriver`/`SelectDriver`); Wave 2 (#1004) adds the foundation-control set (`CheckboxDriver`, `RadioGroupDriver`+`RadioGroupItemDriver`, `SwitchDriver`, `ToggleDriver`, `ToggleGroupDriver`, `TabDriver`+`TabsDriver`, `LabelDriver`, `ProgressDriver`, `AspectRatioDriver`, `AvatarDriver`, `CollapsibleDriver`, `AccordionDriver`); Wave 4 (#1006) adds the interaction-heavy set:

- **`SliderDriver`** — no native `<input type="range">` exists (see the capability-gap audit below), so `setValue` drives the thumb (`role="slider"`) by keyboard arrows (cross-engine) and `dragBy` exposes the pointer path (E2E-only). Single-thumb scope, mirroring the Astryx driver.
- **`ScrollAreaDriver`** — exposes the real `overflow:scroll` viewport as a `viewport` part so callers reach the inherited `scrollBy`/`scrollIntoView`/`getBoundingRect` directly (E2E-only for positional effect); `getScrollbarState` reads the structural `data-state` (jsdom-safe).
- **`PasswordToggleFieldDriver`** — driver for `unstable_PasswordToggleField` (`@radix-ui/react-password-toggle-field`, no Astryx/MUI analogue). `PasswordToggleField.Root` renders no DOM node of its own (a pure context provider), so the scene must supply an explicit wrapping element for the driver's root locator — unique among this package's drivers. Visibility has no `data-state`; the portable read is the input's `type` attribute (`isPasswordVisible`).
- **`OneTimePasswordFieldDriver`** — driver for `unstable_OneTimePasswordField` (`@radix-ui/react-one-time-password-field`, no Astryx/MUI analogue). One `<input>` per character, each addressed by `data-radix-otp-input` + `data-radix-index` (mirroring MUI Slider's `data-index` mark addressing); `setValue` types one character per box rather than using Radix's paste-into-first-box autofill path (no portable `Interactor` primitive for `ClipboardEvent`).

Driver wave 5 extends further. Errors follow the mui-v7 `src/errors/<Name>Error.ts` pattern; Wave 1 added `MenuItemNotFoundError`, shared by `DropdownMenuDriver.selectByLabel` and `SelectDriver.selectByLabel` for the same reason MUI shares it (no Wave 2/4 driver has needed its own error yet).

## Wave 2 driver notes (#1004)

Foundation controls, no portals — every part renders in-tree. Notable findings verified against rendered DOM: Radix `Checkbox`/`Switch`/`RadioGroup.Item` render `<button role="...">` (not a native `<input>`), so state reads use `aria-checked`/`data-state` rather than an input's `checked` property; `ToggleGroup` does not reflect its `value` onto the DOM (only per-item `data-state`), so the driver derives the group value by scanning items rather than reading a single attribute; `Avatar.Image` never mounts under jsdom (its `onLoadingStatusChange` never fires without a real image load), so `AvatarDriver` assertions are structure/fallback-only in jsdom with the loaded-image path E2E-only. Full detail is in each driver's doc comment and the Wave 2 issue comment on #1004.

## Wave 1 driver notes (#1003)

- **`DialogDriver`** follows the documented portal recipe verbatim (re-root at `byRole('dialog', 'Root')`). `Dialog.Title` has NO explicit `role` attribute in the DOM (`role="heading"` is only the `<h2>` tag's _implicit_ ARIA role — invisible to the CSS-only locator engine), so the `title` part uses `byTagName('h2')` instead, one tier below `role` in the anchor priority list, with the `asChild`-override caveat noted in the driver's doc comment. `Dialog.Overlay` renders as a **sibling** `document.body` child of `Dialog.Content` (not nested under one shared `role="presentation"` wrapper the way MUI nests backdrop + paper) and carries no ARIA role/state attribute distinguishing it from arbitrary page content — there is therefore no portable `closeByBackdropClick`; only `closeByEscape` is exposed (Radix's `DismissableLayer` handles `Escape` globally, the same path a real user relies on).
- **`DropdownMenuDriver`** also follows the static portal-hook recipe, but is a `ContainerDriver` (unlike MUI's plain-`ComponentDriver` `MenuDriver`) so a scene can declare custom `content` parts for `CheckboxItem`/`RadioGroup`/submenu scenes. Item iteration uses `childListHelper`'s `:nth-child` walk, not `listHelper`'s `:nth-of-type` one — `DropdownMenu.Separator` renders as a same-tag `<div>` interspersed between items, which silently truncates a `:nth-of-type`-based count/iteration the moment a separator precedes the target item (verified: without `childListHelper`, item lookup past the separator failed). This is the general shape any future Radix list driver whose items can be interspersed with non-item siblings should follow.
- **`PopoverDriver` breaks from the static-hook portal recipe** — read carefully before reusing it for Wave 3/5's `ComboboxDriver`/other Popover-based widgets. `Popover.Content` renders `role="dialog"`, identical to a modal `Dialog.Content`'s role, and the static `overriddenParentLocator`/`overrideLocatorRelativePosition` hooks have no per-instance data to disambiguate them (a scene-declared `data-testid` compound, which resolves this fine for `DialogDriver`, ALSO doesn't naturally arise for popovers — see below). Instead, `PopoverDriver` is constructed from the scene's TRIGGER locator (an ordinary in-tree element) and derives the content locator at call time via `byLinkedElement` following the trigger's `aria-controls` — the same technique `component-driver-astryx`'s `DropdownMenuDriver` uses for its `aria-controls`-linked panel. Consequence: while closed, `aria-controls` is absent and the underlying `LinkedCssLocator` cannot resolve, which the core `byLinkedElement` resolution path (`packages/core/src/utils/locatorUtil.ts`'s `getLinkedCssLocator`) surfaces as a thrown `Error`, not a graceful "not found" — `PopoverDriver` overrides `exists()` to catch and translate that into `false` so `isOpen()`/`waitForOpen()`/`waitForClose()` behave like every other overlay driver. **This throw-on-unresolved-link behavior is a `byLinkedElement`-wide gap, not Popover-specific** — any future driver that anchors a `ContainerDriver`'s root locator on a `LinkedCssLocator` will need the same `exists()` override (or a core fix to `getLinkedCssLocator` to return `null`/swallow instead of throwing, which would remove the need for every such override — flagged here as a candidate core cleanup, not applied in Wave 1 to keep this wave's blast radius to `component-driver-radix-v1`).
- **`SelectDriver`** is the flagship pain point. See its class doc comment for the full `hasPointerCapture`/`scrollIntoView` jsdom-gap writeup; in short, `package-tests/component-driver-radix-test/jest.setup.ts` polyfills both (verified as jsdom-only — the chromium E2E run needed neither). Per the #923 decision below, Radix renders no `data-value` on `Select.Item` (unlike MUI), so `getValue`/`setValue` operate on the item's **visible label**, not an underlying value — documented prominently since it's a deliberate deviation from `component-driver-mui-v7`'s `SelectDriver` semantics, not an oversight. Reading the trigger's selected-label text must exclude the default `Select.Icon` glyph (a sibling `<span aria-hidden="true">` with no other distinguishing attribute) via `> span:not([aria-hidden="true"])`, or `getSelectedLabel()` picks up the icon glyph too.
- **jsdom polyfills added this wave** (`package-tests/component-driver-radix-test/jest.setup.ts`, wired via `jest.config.js`'s `setupFiles`): `hasPointerCapture`/`setPointerCapture`/`releasePointerCapture` (absent in jsdom entirely — https://github.com/jsdom/jsdom/issues/2527), `scrollIntoView` (absent), `ResizeObserver` (absent; needed by `Popover.Arrow`'s `@radix-ui/react-use-size` measurement, same gap `component-driver-astryx-test` already polyfills). All three are no-op/false stubs, guided by actual jsdom failures per this doc's Wave 0 guidance, not added preemptively.
- **Verification**: DOM (Jest/jsdom) and Playwright chromium are both green (28/28 each) for all four Wave 1 drivers plus the pre-existing `SeparatorDriver`. Firefox/WebKit were not run in the sandbox this wave was authored in (proxy-blocked download hosts, a sandbox-only limitation) — needs real CI to confirm; do not assume 3-browser coverage from this doc alone.

## Test harness

[package-tests/component-driver-radix-test](../../package-tests/component-driver-radix-test) mirrors `component-driver-astryx-test`: a Vite example app on **strictPort 3030** with `resolve.dedupe: ['react','react-dom']`, jsdom (jest) + Playwright (chromium/firefox/webkit, dev server auto-started by `playwright.config.ts`), proven via the three-file Separator suite and extended by Wave 1's Select/Dialog/DropdownMenu/Popover and Wave 4's Slider/ScrollArea/PasswordToggleField/OneTimePasswordField suites. No app-shell provider is needed (Radix is unstyled); `Tooltip.Provider` lives inside the tooltip example. `jest.setup.ts` polyfills, added reactively as each wave's scenes first hit a jsdom gap (per Wave 0's guidance — "guided by actual failures, not preemptively"), not ahead of need: `hasPointerCapture`/`setPointerCapture`/`releasePointerCapture` and `scrollIntoView` (Wave 1, hit by Select's open flow) and `ResizeObserver` (needed independently by both Wave 1's Popover/Tooltip/Select/DropdownMenu popper positioning and Wave 4's Slider/ScrollArea sizing — one shared inert stub covers both).

Sandbox note: this environment's Playwright install can only fetch Chromium (Firefox/WebKit's CDN hosts are proxy-blocked); every wave's DoD in this sandbox was verified as jsdom + chromium E2E green, with Firefox/WebKit left for real CI to confirm — see each wave's issue comment (#1003, #1004, #1006).

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
