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

**Initial landing** — the simplest, portal-free primitives, proving the port methodology and the Vue jsdom + Playwright harness. Overlays (Dialog, Select, DropdownMenu, Popover, Tooltip, …), form/list primitives (RadioGroup, Tabs, Slider) and the rest of `component-driver-radix-v1`'s catalog are a follow-up, each needing its own DOM audit before porting (see the relationship note above).

| Driver            | Reka primitive | Notes                                                                                                                               |
| ----------------- | -------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `SeparatorDriver` | `Separator`    | `getOrientation` (`data-orientation`), `isDecorative` (`role="none"` vs `"separator"`).                                             |
| `SwitchDriver`    | `SwitchRoot`   | `<button role="switch">`, `data-state`/`aria-checked`, native `disabled`; `getValue` reads the `value` attribute (defaults `"on"`). |
| `CheckboxDriver`  | `CheckboxRoot` | `<button role="checkbox">`, `data-state` (`checked`/`unchecked`/`indeterminate`); no `getValue` — see the relationship note above.  |
| `ToggleDriver`    | `Toggle`       | Extends `HTMLButtonDriver`; `<button aria-pressed data-state="on"/"off">`.                                                          |

For more in-depth information, visit [https://atomic-testing.dev](https://atomic-testing.dev).
