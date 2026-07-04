---
id: portal-and-overlays
sidebar_label: Portals & overlays
sidebar_position: 1
---

# Testing portals & overlays

Dialogs, menus, drawers, popovers, and tooltips usually **render outside the
subtree of the element that triggers them**. A framework "portals" their markup
to a node near the end of `<body>` so stacking and clipping work regardless of
where the trigger lives. That breaks the default locator assumption: a child
part is normally found _as a descendant of its driver's element_, but portalled
content is a sibling of `<body>`, not a descendant of the trigger.

This guide covers the recipe atomic-testing already provides for that case, the
stacked-overlay consideration, and the one environment limitation you must plan
around — the native HTML Popover API under jsdom.

## The portal re-root recipe

A driver whose content is portalled **re-roots** its child lookups to wherever
the overlay actually mounts. Two optional hooks on the base driver
(`packages/core/src/drivers/ComponentDriver.ts`) control this:

- **`overriddenParentLocator()`** — return the locator the children should be
  resolved _relative to_, instead of this driver's own element. For a portalled
  overlay that is a document-root anchor (e.g. the presentation wrapper the
  overlay renders into), built with the `'Root'` relative position so the search
  starts from the document, not the trigger.
- **`overrideLocatorRelativePosition()`** — return how the children attach to
  that re-rooted parent. Overlays return `'Same'`: the content is matched at the
  re-rooted scope itself rather than as a nested descendant.

The relative-position vocabulary is the `LocatorRelativePosition` union in
`packages/core/src/locators/LocatorRelativePosition.ts`. `Descendant` is the
default everywhere; `Root` and `Same` are the two values that make portal
re-rooting expressible as ordinary CSS.

### Canonical implementations

Do not reinvent this — copy the shape from the Material UI drivers, which are the
reference implementations:

- `packages/component-driver-mui-v7/src/components/DialogDriver.ts`
- `packages/component-driver-mui-v7/src/components/MenuDriver.ts`
- `packages/component-driver-mui-v7/src/components/DrawerDriver.ts`
- `packages/component-driver-mui-v7/src/components/OverlayDriver.ts`

Each overrides the two hooks above to re-root at the overlay's presentation
container and matches its parts there. A `ContainerDriver` subclass additionally
exposes dynamic `content` parts, so the caller declares the overlay's interior
scene the same way as any other component.

### Which frameworks this applies to

- **Material UI** — the reference implementation above.
- **Radix UI / shadcn.ui** — portals like MUI (content mounts as direct
  `<body>` children), but with **no shared wrapper element at all** — not even
  MUI's `role="presentation"` div. Follow the recipe verbatim; per-primitive
  re-root anchors are catalogued in the
  [Radix driver coverage matrix](./radix-driver-coverage.md#portals-how-radix-differs-from-mui-and-astryx).
- **Astryx** — most overlays render **in-tree**, using the native HTML Popover
  API instead of a portal at all — see the jsdom limitation below.

## Stacked portals

When two overlays are open at once (a menu opened from inside a dialog, nested
dialogs), every driver that re-roots to a **document-root** anchor will match the
_first_ such anchor it finds — which may not be the overlay you mean. The fix is
a **scoped root**: re-root to the specific overlay instance (for example, anchor
on the nearest container that carries a stable `role`/`data-*` for _that_
overlay) rather than the generic document-root presentation wrapper, keeping the
surrounding scope so sibling overlays never collide.

This is an **ergonomics refinement of the locator strategy, not a new
`Interactor` method** — it is expressed entirely with the existing re-root hooks
and locators. Reach for it only when a test genuinely drives more than one
simultaneous overlay; a single overlay needs nothing beyond the recipe above.

## Limitation: the native HTML Popover API under jsdom

Newer overlays — including Astryx's (`@astryxdesign/core` ships `Popover`,
`Tooltip`, `Dialog`, and `Overlay`) — use the **native HTML Popover API**:
`HTMLElement.showPopover()`, `hidePopover()`, `togglePopover()`, the
`popover` attribute, and the `:popover-open` pseudo-class.

**jsdom does not implement the Popover API.** There is no layout engine and no
top-layer, so calling `showPopover()` throws or no-ops and `:popover-open` never
matches. Test suites that need open/close _behavior_ under jsdom must monkey-patch
those methods themselves — atomic-testing does not do this for you.

Plan coverage by what each environment can actually observe:

| What you're testing                                        | jsdom (DOM/React/Vue)             | Playwright (E2E) |
| ---------------------------------------------------------- | --------------------------------- | ---------------- |
| Markup/structure of overlay content when rendered          | ✅                                | ✅               |
| `aria-expanded` / `aria-controls` reads on the trigger     | ✅                                | ✅               |
| Driver re-root resolves the overlay's parts                | ✅ (when the overlay is rendered) | ✅               |
| Actual `showPopover`/`:popover-open` open & close behavior | ❌ (not implemented)              | ✅               |
| Top-layer stacking, visibility, geometry                   | ❌ (no layout)                    | ✅               |

The practical rule: assert **structure and ARIA state** in the shared suite so
they run everywhere, and gate **open/close behavior, visibility, and geometry**
to E2E. This mirrors the E2E-only gating used for the scroll, drag, and geometry
primitives.

## Deferred: clipboard

Clipboard interaction (programmatic copy/paste, reading
`navigator.clipboard`) is **not provided** and is intentionally out of scope
until a component genuinely requires paste-driven behavior. The browser
clipboard is permission-gated and unavailable under jsdom, so adding it now would
buy an E2E-only primitive with no consumer. It will be designed when the first
component that needs it lands — do not assume a clipboard primitive exists.
