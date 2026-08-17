---
id: astryx-driver-coverage
sidebar_label: Astryx driver coverage
sidebar_position: 1
---

# Astryx driver coverage matrix

[`@atomic-testing/component-driver-astryx`](https://www.npmjs.com/package/@atomic-testing/component-driver-astryx)
provides component drivers for [Astryx](https://github.com/facebook/astryx)
(`@astryxdesign/core`). Astryx styles with **StyleX**, whose class names are
build-time hashed and therefore _not_ stable anchors — so every driver locates by
**role / accessible name / `data-*` / `data-testid`**, never by a StyleX class.

## How to read coverage

Each driver is exercised by one shared suite that runs in **two worlds**:

- **DOM (jsdom)** — fast, structural. Faithful for anything expressed as markup or
  attributes: `data-*`, `aria-*`, text, `[open]`/`aria-expanded`/`aria-current`,
  typed entry.
- **E2E (Playwright)** — Chromium, Firefox, WebKit. Required for behavior jsdom
  cannot model: the **native Popover API** (`showPopover`), layout/geometry,
  scroll/virtualization, the clipboard, file pickers, and image loading.

A behavior tagged **E2E-only** below is real but only _observable_ in a browser;
the jsdom suite asserts the structural/closed-state facts that hold in both worlds,
and the driver's JSDoc names the gap. **Best-effort v1** marks a driver whose
anchor is structurally fragile (documented inline) pending an upstream change.

## Coverage — display, typography & feedback

All DOM + E2E (Chromium/Firefox/WebKit).

| Component   | Driver              | E2E-only behavior                                                                                 |
| ----------- | ------------------- | ------------------------------------------------------------------------------------------------- |
| Badge       | `BadgeDriver`       | —                                                                                                 |
| Text        | `TextDriver`        | truncation tooltip                                                                                |
| Heading     | `HeadingDriver`     | truncation tooltip                                                                                |
| Code        | `CodeDriver`        | —                                                                                                 |
| Blockquote  | `BlockquoteDriver`  | —                                                                                                 |
| Timestamp   | `TimestampDriver`   | relative-time tooltip & live updates; `data-format` lives on the wrapper, read via a sibling part |
| Divider     | `DividerDriver`     | —                                                                                                 |
| EmptyState  | `EmptyStateDriver`  | —                                                                                                 |
| ProgressBar | `ProgressBarDriver` | — (role switches `meter`↔`progressbar` with determinacy)                                          |
| Spinner     | `SpinnerDriver`     | — (testid placement is conditional on a label)                                                    |
| NavIcon     | `NavIconDriver`     | —                                                                                                 |
| Item        | `ItemDriver`        | —                                                                                                 |
| Markdown    | `MarkdownDriver`    | copy-code (clipboard)                                                                             |
| CodeBlock   | `CodeBlockDriver`   | copy-code button `aria-label` flip (clipboard)                                                    |

## Coverage — media & status

| Component   | Driver              | E2E-only behavior                                                             |
| ----------- | ------------------- | ----------------------------------------------------------------------------- |
| StatusDot   | `StatusDotDriver`   | hover tooltip                                                                 |
| Citation    | `CitationDriver`    | —                                                                             |
| Token       | `TokenDriver`       | disabled state (class-only — not exposed)                                     |
| Avatar      | `AvatarDriver`      | image load-failure → initials fallback (jsdom never fires `onError`)          |
| AvatarGroup | `AvatarGroupDriver` | —                                                                             |
| Thumbnail   | `ThumbnailDriver`   | hover tooltip & lightbox preview                                              |
| Lightbox    | `LightboxDriver`    | double-click zoom & drag-to-pan (real double-click timing / pointer geometry) |

## Coverage — nav chrome

| Component      | Driver                 | E2E-only behavior                                                                                                                       |
| -------------- | ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| TopNav         | `TopNavDriver`         | —                                                                                                                                       |
| TopNavItem     | `TopNavItemDriver`     | —                                                                                                                                       |
| TopNavMenu     | `TopNavMenuDriver`     | menu **open** (native popover); items read while closed via `aria-controls`                                                             |
| TopNavMegaMenu | `TopNavMegaMenuDriver` | panel **open** (native popover); items read while closed via `aria-controls`                                                            |
| Breadcrumbs    | `BreadcrumbsDriver`    | a crumb's `menu` (0.1.9): item reads/`selectByLabel` work closed; the trigger carries no `aria-expanded`, so open state is **E2E-only** |
| SideNav        | `SideNavDriver`        | collapsed visual state                                                                                                                  |
| SideNavItem    | `SideNavItemDriver`    | flyout (collapsed mode)                                                                                                                 |
| MobileNav      | `MobileNavDriver`      | `dialog[open]` (set by `showModal`)                                                                                                     |

## Coverage — chat suite

| Component           | Driver                      | E2E-only behavior                                                                  |
| ------------------- | --------------------------- | ---------------------------------------------------------------------------------- |
| ChatMessage         | `ChatMessageDriver`         | — (`getName` omitted: the name has only a generated-`id` `aria-labelledby` anchor) |
| ChatMessageBubble   | `ChatMessageBubbleDriver`   | —                                                                                  |
| ChatMessageList     | `ChatMessageListDriver`     | auto-scroll                                                                        |
| ChatSystemMessage   | `ChatSystemMessageDriver`   | —                                                                                  |
| ChatToolCalls       | `ChatToolCallsDriver`       | —                                                                                  |
| ChatLayout          | `ChatLayoutDriver`          | scroll-to-bottom button                                                            |
| ChatSendButton      | `ChatSendButtonDriver`      | —                                                                                  |
| ChatDictationButton | `ChatDictationButtonDriver` | live dictation (Web Speech API; mock the `dictation` prop)                         |

## Coverage — hard set (best-effort v1)

These shipped against interactor primitives already available (`contextMenu`,
`setInputFiles`) or via structural workarounds; each names its blocking dependency
inline.

| Component         | Driver                    | v1 scope & blocking dependency                                                                                                                                                                                                                                                                                            |
| ----------------- | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| FileInput         | `FileInputDriver`         | read-side state + `uploadFiles` (via `setInputFiles`). File-chip readback and dropzone drag-and-drop are E2E-only/consumer-`value`-controlled.                                                                                                                                                                            |
| ContextMenu       | `ContextMenuDriver`       | opens via the right-click primitive; items read at the document root. **`isOpen` is E2E-only** — the trigger exposes no open-state ARIA. Single-instance per scene.                                                                                                                                                       |
| AppShell          | `AppShellDriver`          | confirms landmark regions + variant, delegates to child drivers. Responsive collapse / mobile drawer are E2E-only.                                                                                                                                                                                                        |
| ChatComposerInput | `ChatComposerInputDriver` | `contenteditable`: value via `textContent`, **append-only typing** (`userEvent.clear` throws; `getInputValue` returns `null`). Suggestion menu open is E2E-only.                                                                                                                                                          |
| ChatComposer      | `ChatComposerDriver`      | wraps the composer input + send/stop button + status. Enter-to-send is E2E-only.                                                                                                                                                                                                                                          |
| HoverCard         | `HoverCardDriver`         | content via the trigger's `aria-describedby` → layer `id`. The layer is `lazyMount`ed since Astryx 0.4.2, so `getContent` hovers and probes for the reveal. **Open state is E2E-only** (no role/testid/open attr on the layer). Tracked upstream: [facebook/astryx#3240](https://github.com/facebook/astryx/issues/3240). |
| Tooltip           | `TooltipDriver`           | same anchor/limitation as HoverCard. Tracked upstream: [facebook/astryx#3240](https://github.com/facebook/astryx/issues/3240).                                                                                                                                                                                            |

## Not reachable from the DOM

Three reads have no portable anchor in Astryx 0.4.x. Each is a deliberate absence
rather than an oversight, named here so a reader does not go looking for it:

| What                                       | Why                                                                                                                                                                                                            |
| ------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `NumberInput`'s `step`                     | Astryx 0.4.0 replaced the native number input with a text-backed spinbutton; the effective step stays in React state and reaches no attribute. Assert stepping through `stepUp`/`stepDown` and the value.      |
| `FileInput`'s required state               | `aria-required` is invalid on `role="button"`, so Astryx 0.2.0 conveys it with a **translated** visually-hidden sentence in `aria-describedby` — indistinguishable in the DOM from the field's description.    |
| A menu item's `description` / `endContent` | `Item` renders label, description and end content as unmarked sibling `<span>`s separated only by StyleX-hashed classes, so `MenuItemDriver.getLabel` returns the row's whole text. `variant` **is** readable. |

## Also fully covered

Buttons, inputs, toggles, selection controls, overlays/menus, selectors,
date/time pickers, lists, tables and trees are fully covered with
DOM + E2E. See the package's `src/index.ts` for the complete export list; overlay
open/close behavior follows the [Portals & overlays](../guides/portal-and-overlays.md) recipe.

## Out of scope (no driver)

Astryx context providers, style-only modules, and pure layout boxes
(`FormLayout`, `Layer`, `Stack`/`HStack`/`VStack`, `Grid`, `Center`, `Section`,
`Card`, `Skeleton`, `Kbd`, `Icon`, `OverflowList`, …) expose no testable widget
surface and intentionally get **no** driver — assert them incidentally through the
existing `HTMLElement` driver on a `byDataTestId`/`byCssClass` anchor.

`Indicator` (Astryx 0.4.0) belongs here too, despite being a component rather than
a box: it is decorative by construction. 0.4.0 made its `aria-hidden` unforgeable
and turned a forwarded `role` or `tabIndex` into a compile error, so it is never in
the accessibility tree and never a tab stop. Read the state from the control that
owns it — a checkbox's `isChecked`, a menu row's `isChecked` — not from its mark.
