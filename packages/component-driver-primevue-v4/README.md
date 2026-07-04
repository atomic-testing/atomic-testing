# @atomic-testing/component-driver-primevue-v4

Component drivers for [PrimeVue](https://primevue.org/) 4 (Vue 3). Component drivers expose simple APIs for unit tests or end-to-end tests to interact with PrimeVue-based components—reading state and driving actions—so test engineers focus on test flows instead of the component internals.

## The problem

PrimeVue components are styled by swappable theme presets (Aura, Lara, Nora, …) and consumer design tokens, so theme class names are **not stable test anchors**. PrimeVue is accessibility-first: it publishes a per-component WCAG 2.1 AA accessibility contract (roles, `aria-*` states) and stamps its own structural pass-through markers on every part. The stable anchors, in priority order, are:

1. **`role` + ARIA state** per PrimeVue's published per-component accessibility contract (`role="combobox"` + `aria-expanded` on Select, `role="switch"` + `aria-checked` on ToggleSwitch, …) — the a11y contract is the API these drivers test against.
2. **PrimeVue-owned structural attributes** — `data-pc-name` / `data-pc-section`, the documented pass-through/theming markers naming each component and part (the analogue of Radix's `data-state` tier).
3. Never theme/utility classes.

## The solution

The drivers in this package locate PrimeVue parts by those stable anchors and expose high-level interactions. Combined with the Vue 3 adapter (`@atomic-testing/vue-3`), the same scene definitions run across DOM (jsdom) and end-to-end (Playwright) tests.

## Target package & version pin

This driver targets **PrimeVue 4** and is declared as a **peer dependency pinned to `^4.0.0`**: consumers bring their own PrimeVue. PrimeVue 4 renamed several components this package covers (`Dropdown` → `Select`, `InputSwitch` → `ToggleSwitch`, `TabView` → `Tabs`), so the v4 pin is also a DOM-contract pin — PrimeVue 3 renders different roots and markers. PrimeVue requires **Vue 3**, so test with `@atomic-testing/vue-3` to match your app.

## Installation

```bash
npm install @atomic-testing/core @atomic-testing/vue-3 \
  @atomic-testing/component-driver-html @atomic-testing/component-driver-primevue-v4 \
  primevue --save-dev
```

Refer to the [documentation](https://atomic-testing.dev/) for usage patterns and examples.

## Drivers

Drivers land in waves (see the umbrella issue #1018); this table grows with each wave.

| Driver | PrimeVue component | Notes |
| ------ | ------------------ | ----- |

## Teleported overlays (`appendTo`)

PrimeVue overlays (Select panel, Dialog, Menu popup, …) Teleport to `document.body` by default via the uniform `appendTo` prop. The overlay drivers follow the MUI portal re-root recipe — the portalled surface is located document-rooted ('Root'-relative), not under the in-tree trigger. See the
[portals & overlays guide](https://atomic-testing.dev/docs/guides/portal-and-overlays).
Non-default `appendTo="self"` is not covered by the v1 drivers.

For more in-depth information, visit [https://atomic-testing.dev](https://atomic-testing.dev).
