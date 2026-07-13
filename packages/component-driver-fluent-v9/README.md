# @atomic-testing/component-driver-fluent-v9

Component drivers for [Fluent UI v9](https://react.fluentui.dev/) ("Fluent 2", `@fluentui/react-components`). Component drivers expose simple APIs for unit tests or end-to-end tests to interact with Fluent-based components—reading state and driving actions—so test engineers focus on test flows instead of the component internals.

## The problem

Fluent v9 styles every component with [Griffel](https://github.com/microsoft/griffel), an atomic CSS-in-JS engine — the classes it emits are hashed and change across builds, so they are **not stable test anchors**. Fluent also ships a strong accessibility program (it is the Microsoft 365/Office design system), so the stable anchors, in priority order, are:

1. **`role` + ARIA state** — Fluent renders correct roles/`aria-*` per component (e.g. `aria-pressed` on `ToggleButton`, `aria-disabled` on `Link`).
2. **Fluent's own un-hashed structural classes** — every component stamps a plain `fui-<ComponentName>` class (and `fui-<ComponentName>__<part>` for sub-parts, e.g. `fui-Field__hint`) alongside the hashed Griffel utility classes. These are Fluent-owned and stable across releases; the drivers in this package use them where role/ARIA isn't enough (e.g. `FieldDriver`'s hint/validation-message reads).
3. **Never the hashed Griffel utility classes.**

Several core controls (`Input`, `Textarea`, `Checkbox`, `Switch`, `Radio`, `Select`) render as **real native form elements** at their root — `data-testid` (or any locator) placed on the component lands directly on the native `<input>`/`<textarea>`/`<select>`, not a styled wrapper — so this package reuses `@atomic-testing/component-driver-html`'s drivers wholesale wherever that holds.

## The solution

The drivers in this package locate Fluent parts by those stable anchors and expose high-level interactions. Combined with the React adapter (`@atomic-testing/react-19` or another React major), the same scene definitions run across DOM (jsdom) and end-to-end (Playwright) tests.

## Target package & version pin

This driver targets **Fluent UI v9** and is declared as a **peer dependency pinned to `^9.0.0`**: consumers bring their own `@fluentui/react-components`. Fluent v8 (`@fluentui/react`) is a materially different DOM/styling contract (`mergeStyles`, no Griffel) and is out of scope for this package.

## Installation

```bash
npm install @atomic-testing/core @atomic-testing/react-19 \
  @atomic-testing/component-driver-html @atomic-testing/component-driver-fluent-v9 \
  @fluentui/react-components --save-dev
```

Refer to the [documentation](https://atomic-testing.dev/) for usage patterns and examples.

## Drivers

Drivers land in waves (see the umbrella issue #1098); this table grows with each wave. Wave 1 (core form primitives) ships in full below.

| Driver                | Fluent component                       | Notes                                                                                                                                          |
| --------------------- | --------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `ButtonDriver`        | `Button`                                | Native `<button>`; delegates wholesale to `HTMLButtonDriver`.                                                                                    |
| `CompoundButtonDriver`| `CompoundButton`                        | Same native `<button>` root as `Button`; `getSecondaryContent()` reads the `fui-CompoundButton__secondaryContent` part (see JSDoc for the known primary/secondary text-splitting limitation). |
| `ToggleButtonDriver`  | `ToggleButton`                          | Native `<button>`; pressed state read/written via `aria-pressed` (no native "pressed" concept exists for `<button>`).                            |
| `InputDriver`         | `Input`                                 | The root IS a native `<input>` — full `HTMLTextInputDriver` surface, incl. `isError` via `aria-invalid`.                                          |
| `TextareaDriver`      | `Textarea`                              | The root IS a native `<textarea>` — full `HTMLTextAreaDriver` surface.                                                                            |
| `CheckboxDriver`      | `Checkbox`                              | Extends `HTMLCheckboxDriver` (the root IS a real native `<input type="checkbox">`); `label` prop renders a sibling `<label for>`, resolved via the `for`↔`id` link. `isIndeterminate()` reads the live `.indeterminate` property via the `:indeterminate` CSS pseudo-class. |
| `SwitchDriver`        | `Switch`                                | Same shape as `Checkbox`, but no `value` concept (pure on/off) — does not implement `IFormFieldDriver`.                                          |
| `RadioDriver`         | `Radio`                                 | The root IS a real native `<input type="radio">`; `setSelected(false)` is rejected (native radio semantics).                                     |
| `RadioGroupDriver`    | `RadioGroup`                            | Delegates to `HTMLRadioButtonGroupDriver` — **point its ScenePart locator at the radio inputs** (e.g. the group container appended with an `input[type="radio"]` descendant selector), not at the `[role="radiogroup"]` wrapper.  |
| `SelectDriver`        | `Select`                                | The root IS a native `<select>` — full `HTMLSelectDriver` surface.                                                                                |
| `LabelDriver`         | `Label`                                 | Plain native `<label>`; `getFor()` reads the linked control's `id`.                                                                              |
| `FieldDriver`         | `Field`                                 | Container wrapper; `getLabel`/`getHint`/`getValidationMessage` read descendant parts anchored on Fluent's `fui-Field__*` structural classes.       |
| `LinkDriver`          | `Link`                                  | Native `<a>`; overrides `isDisabled` to read `aria-disabled` (an anchor has no native `disabled` property).                                       |
| `DividerDriver`       | `Divider`                               | `[role="separator"]`; `getOrientation()` reads `aria-orientation`.                                                                                 |
| `ImageDriver`         | `Image`                                 | Native `<img>`; `getSrc`/`getAlt` read attributes directly.                                                                                       |
| `TextDriver`          | `Text`                                  | Plain content wrapper; all behavior is inherited (`getText`).                                                                                     |

## Known gaps (Wave 1)

- **`CompoundButtonDriver.getSecondaryContent()`** returns the secondary line, but there is no way to read *only* the primary label — the two render as adjacent text nodes in one container, and CSS/`textContent` cannot exclude nested content from an ancestor read.
