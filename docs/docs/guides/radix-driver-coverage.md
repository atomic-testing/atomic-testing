---
id: radix-driver-coverage
sidebar_label: Radix / shadcn driver coverage
sidebar_position: 3
---

# Radix / shadcn driver coverage matrix

[`@atomic-testing/component-driver-radix-v1`](https://www.npmjs.com/package/@atomic-testing/component-driver-radix-v1)
provides component drivers for [Radix UI Primitives](https://www.radix-ui.com/primitives)
(the unified `radix-ui@^1.0.0` package, not the per-primitive `@radix-ui/react-*`
packages — they render identical DOM, so the drivers work against either).

[`@atomic-testing/component-driver-shadcn-v1`](https://www.npmjs.com/package/@atomic-testing/component-driver-shadcn-v1)
is a **pure re-export** of the same drivers under the name your codebase speaks
if you consume [shadcn/ui](https://ui.shadcn.com): shadcn components are styled
Radix primitives, so their DOM — and therefore their drivers — are identical.
Re-exporting (rather than subclassing or copying) keeps a single class identity
per driver, so `instanceof` agrees across both package names. The shadcn
package declares no drivers of its own and tracks `component-driver-radix-v1`'s
major version in lockstep; add new drivers only to `component-driver-radix-v1`.

Radix primitives are unstyled, so — like Astryx's StyleX classes — Tailwind/shadcn
utility class names are **never** stable anchors. Every driver locates by, in
priority order: **`role` + accessible name**, **`data-slot`** (the shadcn/ui
convention naming each part), then Radix's own **`data-state`/`data-orientation`/
`data-disabled`** attributes. Radix's generated ids (`radix-_r_0_`) are
render-order-dependent and are never hardcoded; id links (`aria-controls`,
`aria-labelledby`, `label[for]`) are resolved with `byLinkedElement` instead.

## How to read coverage

Each driver is exercised by one shared suite that runs in **two worlds**, same
as every other package in this repo:

- **DOM (jsdom)** — fast, structural. Faithful for markup, attributes
  (`data-*`, `aria-*`), text, and open/closed state, because Radix overlays are
  plain `createPortal` + popper positioning with **no native Popover API**
  involved (unlike Astryx — see the portal note below).
- **E2E (Playwright)** — Chromium, Firefox, WebKit. Required for geometry
  (Slider drag, ScrollArea positional effects), pointer-driven interaction, and
  timer-driven behavior (Toast auto-dismiss).

A behavior tagged **E2E-only** below is real but only _observable_ in a
browser; the jsdom suite asserts the structural/ARIA facts that hold in both
worlds, and the driver's JSDoc names the gap.

## Portals: how Radix differs from MUI and Astryx

Radix overlays (`Dialog`, `DropdownMenu`, `Popover`, `Tooltip`, `ContextMenu`,
`Select`, …) portal their content as **direct children of `document.body`** —
closer to MUI's behavior than Astryx's, but not identical:

- **MUI** wraps portalled content in a shared `role="presentation"` element.
- **Radix** mounts with **no shared wrapper at all** — the overlay/content
  elements are themselves direct `<body>` children (sometimes as siblings, e.g.
  `Dialog.Overlay` and `Dialog.Content` land as two separate body children).
- **Astryx** renders most overlays **in-tree** using the native HTML Popover
  API (`showPopover()`/`:popover-open`), not a portal.

The [portal re-root recipe](./portal-and-overlays.md) still applies verbatim —
copy the shape from the Material UI drivers, exactly as the guide says — but
per-primitive re-root anchors differ enough from MUI's own DOM that they're
worth cataloguing:

| Primitive                  | Portalled node under `<body>`                                                                                               | Re-root anchor                                                                     |
| -------------------------- | --------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| Dialog / AlertDialog       | overlay `<div data-state>` and content `<div role="dialog"\|"alertdialog">` are **each** direct body children               | `byRole('dialog'\|'alertdialog', 'Root')`                                          |
| DropdownMenu / ContextMenu | `div[data-radix-popper-content-wrapper]` wrapping content `<div role="menu">`                                               | `byRole('menu', 'Root')`                                                           |
| Select                     | content `<div role="listbox">` (direct body child)                                                                          | `byRole('listbox', 'Root')`                                                        |
| Popover                    | `div[data-radix-popper-content-wrapper]` wrapping content `<div role="dialog">` — collides with an open modal Dialog's role | trigger's `aria-controls` → `byLinkedElement` (not a static role re-root)          |
| Tooltip / HoverCard        | `div[data-radix-popper-content-wrapper]` wrapping a **role-less** positioned `<div>`                                        | trigger's `aria-describedby`/forwarded `data-testid` (no shared role to anchor on) |
| Menubar (per menu)         | one `data-radix-popper-content-wrapper` per open menu, several same-role menus under one bar                                | trigger's `aria-controls` → `byLinkedElement` (role re-root would collide)         |

NavigationMenu, Toast, and Toolbar render **in-tree**, no portal at all.

## Coverage — Wave 0 (foundation) and Wave 1 (pain-first flagship)

| Component    | Driver               | E2E-only behavior                                                                                                                                                                |
| ------------ | -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Separator    | `SeparatorDriver`    | —                                                                                                                                                                                |
| Select       | `SelectDriver`       | — (jsdom needs `hasPointerCapture`/`scrollIntoView` polyfills the harness ships; **value identity is label-based**, not `data-value`, since Radix renders none on `Select.Item`) |
| Dialog       | `DialogDriver`       | only `closeByEscape` is exposed — `Dialog.Overlay` carries no ARIA distinguishing it from page content, so there is no portable `closeByBackdropClick`                           |
| DropdownMenu | `DropdownMenuDriver` | a `ContainerDriver`, so scenes can declare custom `content` parts for `CheckboxItem`/`RadioGroup`/submenu content                                                                |
| Popover      | `PopoverDriver`      | trigger-anchored via `aria-controls` → `byLinkedElement` (its content shares `role="dialog"` with modal `Dialog`, so a static re-root would collide)                             |

## Coverage — Wave 2 (foundation controls)

All in-tree — no portals.

| Component   | Driver                                      | E2E-only behavior                                                                                                   |
| ----------- | ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| Checkbox    | `CheckboxDriver`                            | — (renders `<button role="checkbox">`, not a native input — reads `aria-checked`/`data-state`)                      |
| RadioGroup  | `RadioGroupDriver` / `RadioGroupItemDriver` | — (same button-not-input shape as Checkbox/Switch)                                                                  |
| Switch      | `SwitchDriver`                              | —                                                                                                                   |
| Toggle      | `ToggleDriver`                              | —                                                                                                                   |
| ToggleGroup | `ToggleGroupDriver`                         | — (group value has no single DOM attribute; the driver derives it by scanning per-item `data-state`)                |
| Tabs        | `TabDriver` / `TabsDriver`                  | —                                                                                                                   |
| Label       | `LabelDriver`                               | —                                                                                                                   |
| Progress    | `ProgressDriver`                            | —                                                                                                                   |
| AspectRatio | `AspectRatioDriver`                         | —                                                                                                                   |
| Avatar      | `AvatarDriver`                              | loaded-image path — `Avatar.Image`'s `onLoadingStatusChange` never fires under jsdom; structure/fallback only there |
| Collapsible | `CollapsibleDriver`                         | —                                                                                                                   |
| Accordion   | `AccordionDriver`                           | —                                                                                                                   |

## Coverage — Wave 3 (remaining overlays & menus)

| Component      | Driver                                              | E2E-only behavior                                                                                                                                                                                 |
| -------------- | --------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| AlertDialog    | `AlertDialogDriver`                                 | — (`DialogDriver`'s shape, re-rooted at `role="alertdialog"`; `Cancel`/`Action` are consumer `content` parts)                                                                                     |
| Tooltip        | `TooltipDriver`                                     | delay-driven open transitions and pointer-leave close (jsdom fires no `pointerleave`); hover-open itself works under jsdom                                                                        |
| HoverCard      | `HoverCardDriver`                                   | same hover-close split as Tooltip. The one Radix overlay with **no a11y anchor at all** (sighted-users-only by design) — re-roots at `[data-radix-popper-content-wrapper]` instead of a role/link |
| ContextMenu    | `ContextMenuDriver`                                 | — (opens via the right-click primitive; menu surface is document-rooted, safe because Radix menus are modal)                                                                                      |
| Menubar        | `MenubarDriver` / `MenubarMenuDriver`               | — (bar is in-tree `role="menubar"`; each menu follows its own trigger's `aria-controls` link)                                                                                                     |
| NavigationMenu | `NavigationMenuDriver` / `NavigationMenuItemDriver` | — (entirely in-tree — content mounts into `NavigationMenu.Viewport`, no portal)                                                                                                                   |
| Toast          | `ToastDriver`                                       | timer-driven auto-dismissal is untested by the suite (real-time behavior); click paths (`Action`/`Close`) are covered                                                                             |
| Toolbar        | `ToolbarDriver`                                     | —                                                                                                                                                                                                 |

## Coverage — Wave 4 (interaction-heavy)

| Component            | Driver                       | E2E-only behavior                                                                                                                                                                         |
| -------------------- | ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Slider               | `SliderDriver`               | pointer-driven `dragBy`; keyboard `setValue` (arrows/Home/End) works in both worlds. No native `<input type="range">` exists in the DOM — single-thumb scope, mirroring the Astryx driver |
| ScrollArea           | `ScrollAreaDriver`           | positional scroll effects (`scrollBy`/`scrollIntoView` results); `getScrollbarState`'s `data-state` read is jsdom-safe                                                                    |
| PasswordToggleField  | `PasswordToggleFieldDriver`  | — (`PasswordToggleField.Root` renders no DOM node of its own — a pure context provider — so the scene must supply an explicit wrapping element for the driver's root locator)             |
| OneTimePasswordField | `OneTimePasswordFieldDriver` | — (`setValue` types one character per box rather than using Radix's paste-into-first-box autofill path — no portable `Interactor` primitive for `ClipboardEvent`)                         |

## Coverage — Wave 5 (best-effort v1: Combobox)

Radix ships no Combobox primitive. `ComboboxDriver` targets the canonical
shadcn/ui **composition** — a Radix `Popover` hosting a
[cmdk](https://cmdk.paco.me) `Command` palette — and is this package's one
deliberate two-library driver, shipped per the same "ship a documented, honest
v1 scope and name the blocking dependency" discipline Astryx's hard-set drivers
use (see [facebook/astryx#3240](https://github.com/facebook/astryx/issues/3240)
for that precedent). The ship-vs-descope investigation and evidence are
recorded on [#1007](https://github.com/atomic-testing/atomic-testing/issues/1007).

| Component | Driver                                    | v1 scope & blocking dependency                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| --------- | ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Combobox  | `ComboboxDriver` / `ComboboxOptionDriver` | The Radix half (trigger + portalled panel) is inherited from `PopoverDriver` unchanged; the cmdk half anchors on cmdk's public styling attributes (`[cmdk-input]`, `[cmdk-list]`, `[cmdk-item]`, `[cmdk-empty]`). **Selected value** is read as the trigger's visible text — the composition keeps selection in consumer React state, per shadcn's own recipe, so there is no DOM attribute carrying it. **`Command.Group` headings are not modeled** — grouped items are still enumerated (in document order) via `childListHelper`'s wrapper descent. **cmdk-inside-`Dialog`** (the command-palette usage) is out of scope — sustained demand for that pairing would motivate a standalone `component-driver-cmdk` package rather than folding it into this driver. `cmdk` is declared an **optional** peer dependency of `component-driver-radix-v1` (the driver never imports it — the coupling is CSS-attribute-only), so only Combobox consumers need it installed. |

Unlike `SelectDriver` (label-based, since Radix renders no `data-value` on
`Select.Item`), `ComboboxDriver` is **value-based** (`selectByValue`,
`getHighlightedValue`, `getOptionValues`) because cmdk **does** render
`data-value` on every `Command.Item` — `selectByLabel` is also provided for
text-first scenes. Filtering is cmdk-internal and **unmounts** non-matching
items rather than hiding them, so `getOptionCount`/`getOptionValues` reflect
the current filter by construction and `isEmpty()` is a presence check against
`Command.Empty`.

## Out of scope (no driver)

- shadcn's **Command** (standalone), **Calendar**, **Drawer**, **Sonner**, and
  **Carousel** blocks are not Radix primitives — they wrap cmdk,
  react-day-picker, vaul, and embla-carousel respectively, and are out of scope
  for this package (Combobox is the one exception, since it composes Radix's
  own Popover).
- Radix's **Slot**, **VisuallyHidden**, and **AccessibleIcon** are
  utility/layout primitives with no testable widget surface — no driver, the
  same treatment Astryx gives `Stack`/`Card`/`Skeleton`/`Icon`.

## Framework roadmap

React ships first. Vue support (against [Reka UI](https://reka-ui.com), the
unofficial Vue port of Radix) is planned as its own follow-up effort once the
React driver set is stable — not bundled into this package.
