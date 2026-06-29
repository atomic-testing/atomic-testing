# @atomic-testing/component-driver-astryx

Component drivers for [Astryx](https://github.com/facebook/astryx), Meta's open-source, StyleX-based design system. Component drivers expose simple APIs for unit tests or end-to-end tests to interact with Astryx components—reading state and driving actions—so test engineers focus on test flows instead of the component internals.

## The problem

Astryx styles components with [StyleX](https://stylexjs.com), whose class names are build-time hashed and therefore are **not stable test anchors**. Astryx is ARIA-role-first: widgets expose a semantic `role` plus an accessible name (visible text or `aria-label`). The stable anchors are **`data-testid`, `role`, and accessible name—never StyleX classes**.

## The solution

The drivers in this package locate Astryx components by those stable anchors and expose high-level interactions. Combined with a React adapter, the same scene definitions run across DOM (jsdom) and end-to-end (Playwright) tests.

## Target package & version pin

This driver targets the published Astryx package **[`@astryxdesign/core`](https://www.npmjs.com/package/@astryxdesign/core)** (the components live here; theme packages such as `@astryxdesign/theme-neutral` are separate). It is declared as a **peer dependency pinned to `^0.1.1`**: consumers bring their own Astryx, and the caret on a `0.x` release locks the `0.1` minor (`>=0.1.1 <0.2.0`)—the closest analogue to "pin a major" while Astryx is pre-1.0. Astryx peer-requires **React ≥19**.

> Astryx forks (`-vN`) are deferred: a single package tracks one `0.x` minor until a breaking Astryx release warrants a versioned fork.

## Installation

```bash
npm install @atomic-testing/core @atomic-testing/react-19 \
  @atomic-testing/component-driver-html @atomic-testing/component-driver-astryx \
  @astryxdesign/core --save-dev
```

Refer to the [documentation](https://atomic-testing.dev/) for usage patterns and examples.

## Drivers

Wave 1 — buttons, inputs, toggles and the structural/feedback primitives around
them. Each driver locates its component by `data-testid`, `role`, or accessible
name (never a StyleX class) and exposes high-level reads and interactions. Method
details are in the [API docs](https://atomic-testing.dev); anchoring rationale and
any E2E-only behaviour live in each driver's source doc comment.

### Buttons & actions

| Driver                    | Astryx component    | Notes                                                                      |
| ------------------------- | ------------------- | -------------------------------------------------------------------------- |
| `ButtonDriver`            | `Button`            | `getLabel`/`isDisabled`/`isLoading`; inherited `click`.                    |
| `IconButtonDriver`        | `IconButton`        | Icon-only Button; `getLabel` reads the always-present `aria-label`.        |
| `ToggleButtonDriver`      | `ToggleButton`      | `isSelected`/`setSelected` via `aria-pressed`.                             |
| `ButtonGroupDriver`       | `ButtonGroup`       | List of buttons; `clickButton(name)`, `getButtonCount`, `getOrientation`.  |
| `ToggleButtonGroupDriver` | `ToggleButtonGroup` | `select`/`deselect`/`isSelected` by `aria-label`; `getSelectedLabels`.     |
| `LinkDriver`              | `Link`              | `getHref`/`getTarget`/`getRel`; `isButtonFallback` (no-`href` `<button>`). |

### Text inputs

| Driver                   | Astryx component | Notes                                                                                 |
| ------------------------ | ---------------- | ------------------------------------------------------------------------------------- |
| `TextInputDriver`        | `TextInput`      | Value, `clear`, `getLabel`/`getStatusMessage` (a11y links), `isRequired`/`isInvalid`. |
| `TextAreaDriver`         | `TextArea`       | Value, `getRows`, `getCharCount`.                                                     |
| `NumberInputDriver`      | `NumberInput`    | Value, `getMin`/`getMax`/`getStep`/`getUnits`; `stepUp`/`stepDown` (E2E).             |
| `TimeInputDriver`        | `TimeInput`      | `getValue` returns the display string (not ISO); `increment`/`decrement` (E2E).       |
| `AstryxFieldInputDriver` | —                | Shared base for the field inputs above (linked label/status resolution).              |

### Selection controls

| Driver                   | Astryx component   | Notes                                                                      |
| ------------------------ | ------------------ | -------------------------------------------------------------------------- |
| `CheckboxInputDriver`    | `CheckboxInput`    | `isChecked`/`toggle`; `isIndeterminate` (`aria-checked="mixed"`).          |
| `RadioListDriver`        | `RadioList`        | `getSelectedValue`/`selectByValue` by radio `value`; `isItemChecked`.      |
| `CheckboxListDriver`     | `CheckboxList`     | Label/index addressed (item value is not in the DOM); `getCheckedLabels`.  |
| `CheckboxListItemDriver` | —                  | A single `CheckboxList` row: `getLabel`/`isChecked`/`toggle`.              |
| `SwitchDriver`           | `Switch`           | `isOn`/`turnOn`/`turnOff` via the `role="switch"` input.                   |
| `SegmentedControlDriver` | `SegmentedControl` | Single-select radiogroup; value via `data-value`.                          |
| `SelectableCardDriver`   | `SelectableCard`   | `isSelected`/`toggle` via the card's hidden checkbox; clicks the card.     |
| `SliderDriver`           | `Slider`           | Single-thumb; `getValue` (`aria-valuenow`), keyboard `setValue` (no drag). |

### Structure & feedback

| Driver              | Astryx component | Notes                                                                            |
| ------------------- | ---------------- | -------------------------------------------------------------------------------- |
| `FieldDriver`       | `Field`          | `getLabel`/`getDescription`/`getStatusMessage`, `isRequired`/`isOptional`.       |
| `InputGroupDriver`  | `InputGroup`     | `getLabel`, `getAddonTexts`.                                                     |
| `FieldStatusDriver` | `FieldStatus`    | `getStatus`/`getMessage`/`isError` via stable `data-type` (role is conditional). |
| `BannerDriver`      | `Banner`         | `getTitle`/`getDescription`/`getStatus`, `dismiss`, `toggleExpand`.              |
| `PaginationDriver`  | `Pagination`     | `getCurrentPage`, `goToPage`/`next`/`previous`, `getCountText`.                  |
| `CollapsibleDriver` | `Collapsible`    | `isExpanded`/`expand`/`collapse` via the trigger's `aria-expanded`.              |

For more in-depth information, visit [https://atomic-testing.dev](https://atomic-testing.dev).
