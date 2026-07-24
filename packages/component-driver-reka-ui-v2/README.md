# @atomic-testing/component-driver-reka-ui-v2

Component drivers for [Reka UI](https://reka-ui.com) primitives (the Vue port of Radix UI Primitives). Component drivers expose simple APIs for unit tests or end-to-end tests to interact with Reka-based components — reading state and driving actions — so test engineers focus on test flows instead of the component internals.

## The problem

Reka primitives are unstyled: consumers style them with whatever they like, so class names are **not stable test anchors**. Reka is ARIA-first and additionally exposes machine-readable state through `data-*` attributes, mirroring Radix's own contract. The stable anchors, in priority order, are:

1. **`role` + accessible name** (Reka renders correct ARIA roles on every part)
2. **Reka state attributes** — `data-state`, `data-orientation`, `data-disabled`, …
3. Never utility classes.

## The solution

The drivers in this package locate Reka parts by those stable anchors and expose high-level interactions. Combined with `@atomic-testing/vue-3`, the same scene definitions run across DOM (jsdom) and end-to-end (Playwright) tests.

## Relationship to `component-driver-radix-v1`

Reka UI is a near-mechanical relabel of Radix's own DOM/ARIA output — same WAI-ARIA-pattern roles, same `data-state` semantics. Every driver here is ported from `@atomic-testing/component-driver-radix-v1`, but **each was re-audited against Reka's actual rendered DOM** (SSR-rendered, primitive by primitive) rather than assumed identical — see each driver's own "DOM audit" note. One confirmed, non-cosmetic delta so far: Reka's `CheckboxRoot` does not forward a `value` attribute onto its root element at all (Radix's does), so this package's `CheckboxDriver` has no `getValue()` — a genuine per-component difference, not a renaming exercise.

## Target package & version pin

This driver targets **Reka UI 2** and is declared as a **peer dependency pinned to `^2.0.0`**: consumers bring their own Reka UI. Reka UI requires **Vue 3**, so test with `@atomic-testing/vue-3` to match your app.

## Installation

```bash
npm install @atomic-testing/core @atomic-testing/vue-3 \
  @atomic-testing/component-driver-html @atomic-testing/component-driver-reka-ui-v2 \
  reka-ui --save-dev
```

Refer to the [documentation](https://atomic-testing.dev/) for usage patterns and examples.

## Drivers

Every primitive from the wave's original scope is now landed: the simplest portal-free primitives (Separator/Switch/Checkbox/Toggle/ToggleGroup/RadioGroup/Tabs/Slider) plus the portal-based overlays (Dialog/Popover/Tooltip/Select/DropdownMenu). Each was re-audited against Reka's actual rendered DOM rather than assumed identical to radix-v1 — see the relationship note above and each driver's own "DOM audit" JSDoc for what was verified.

| Driver                                      | Reka primitive                                                             | Notes                                                                                                                                                                                                                                                                                                   |
| ------------------------------------------- | -------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `SeparatorDriver`                           | `Separator`                                                                | `getOrientation` (`data-orientation`), `isDecorative` (`role="none"` vs `"separator"`).                                                                                                                                                                                                                 |
| `SwitchDriver`                              | `SwitchRoot`                                                               | `<button role="switch">`, `data-state`/`aria-checked`, native `disabled`; `getValue` reads the `value` attribute (defaults `"on"`).                                                                                                                                                                     |
| `CheckboxDriver`                            | `CheckboxRoot`                                                             | `<button role="checkbox">`, `data-state` (`checked`/`unchecked`/`indeterminate`); no `getValue` — see the relationship note above.                                                                                                                                                                      |
| `ToggleDriver`                              | `Toggle`                                                                   | Extends `HTMLButtonDriver`; `<button aria-pressed data-state="on"/"off">`.                                                                                                                                                                                                                              |
| `ToggleGroupDriver`                         | `ToggleGroupRoot`/`ToggleGroupItem`                                        | List of `ToggleDriver` items (index/label lookup only — Radix never reflects `value`, but Reka's `ToggleGroupItem` DOES, a possible future follow-up); root is `role="group"` in both `single`/`multiple` modes (unlike Radix's `radiogroup`/`toolbar`).                                                |
| `RadioGroupDriver` / `RadioGroupItemDriver` | `RadioGroupRoot`/`RadioGroupItem`                                          | Group exposes `IInputDriver<string \| null>` (value-by-checked-item) + `IDisableableDriver`/`IRequirableDriver`; items are `<button role="radio">` with `value`/`data-state`/`aria-checked`. Byte-for-byte match with radix-v1.                                                                         |
| `TabsDriver` / `TabDriver`                  | `TabsRoot`/`TabsList`/`TabsTrigger`/`TabsContent`                          | Extends `ListComponentDriver`; `TabDriver` extends `HTMLButtonDriver` (`role="tab"`/`aria-selected`/`data-state`); `getPanelText` resolves `aria-controls` → `role="tabpanel"` at read time.                                                                                                            |
| `SliderDriver`                              | `SliderRoot`/`SliderTrack`/`SliderRange`/`SliderThumb`                     | Single-thumb (no verified index-addressable attribute for multi-thumb, same scope limit as radix-v1); keyboard-driven `setValue`, E2E-only `dragBy`. No native `<input type="range">`.                                                                                                                  |
| `DialogDriver`                              | `DialogRoot`/`DialogContent`                                               | `ContainerDriver`; portal re-root (`overriddenParentLocator`/`overrideLocatorRelativePosition` → `byRole('dialog', 'Root')`/`'Same'`) to the document-level `[role="dialog"]`. `getTitle`, `closeByEscape`, `waitForOpen`/`waitForClose`, `isOpen`.                                                     |
| `PopoverDriver`                             | `PopoverRoot`                                                              | Anchored at the trigger, not the portalled content (`role="dialog"` collides with `DialogDriver`'s own content); resolves content via `aria-controls`/`byLinkedElement`. `isOpen`/`open`/`close`/`waitForOpen`/`waitForClose`/`closeByEscape`.                                                          |
| `TooltipDriver`                             | `TooltipRoot`                                                              | Trigger-anchored (portalled content is role-less); `isOpen`/`getState` read the trigger's `data-state`, `getContent` follows `aria-describedby` to the hidden `role="tooltip"` span, `open()` hovers, `dismiss()` closes via Escape.                                                                    |
| `SelectDriver`                              | `SelectRoot`/`SelectTrigger`/`SelectContent`/`SelectViewport`/`SelectItem` | Label-based `getValue`/`setValue` (no `data-value` on `SelectItem`, same as radix-v1). Needs the `hasPointerCapture` jsdom polyfill in the test package's `jest.setup.ts` — jsdom has no Pointer Events capture API at all, so the trigger's `onPointerDown` throws on the very first click without it. |
| `DropdownMenuDriver`                        | `DropdownMenuRoot`/`DropdownMenuContent`                                   | Extends the shared `MenuContentDriverBase` (`getMenuItemByLabel`/`selectByLabel`/`getMenuItemCount`/`getMenuItemByIndex` via `childListHelper`, not `listHelper` — separators share the item's tag); portal re-root like `DialogDriver`.                                                                |

For more in-depth information, visit [https://atomic-testing.dev](https://atomic-testing.dev).
