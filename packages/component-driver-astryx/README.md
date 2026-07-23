# @atomic-testing/component-driver-astryx

Component drivers for [Astryx](https://github.com/facebook/astryx), Meta's open-source, StyleX-based design system. Component drivers expose simple APIs for unit tests or end-to-end tests to interact with Astryx components—reading state and driving actions—so test engineers focus on test flows instead of the component internals.

## Why atomic-testing

Testing a UI built on a third-party component library is hard to keep maintainable: a component's markup is an implementation detail, so tests that reach into it break every time the component changes or the library upgrades, and each framework/runner has its own interaction API. Atomic Testing gives you one consistent way to interact with components across every environment — describe the parts of a scene once, as a **ScenePart**, and drive them through **component drivers** that expose semantic actions (`click()`, `setValue()`, `getText()`) instead of DOM manipulation. The same scene and the same test body then run under DOM (jsdom) and end-to-end (Playwright), because only the `Interactor` underneath changes. See [Why Atomic Testing?](https://atomic-testing.dev/docs/why-atomic-testing) for the full case.

This package adapts that pattern to Astryx. Astryx styles components with [StyleX](https://stylexjs.com), whose class names are build-time hashed and therefore **not stable test anchors** — one more reason markup-level assertions are a poor fit here specifically. Astryx is also ARIA-role-first: widgets expose a semantic `role` plus an accessible name (visible text or `aria-label`). The drivers in this package locate Astryx components by those stable anchors — **`data-testid`, `role`, and accessible name, never StyleX classes** — and expose the same high-level interactions across both environments.

## Usage

Declare the Astryx parts a scene needs, once, as a `ScenePart`:

```typescript
import { ButtonDriver, TextInputDriver } from '@atomic-testing/component-driver-astryx';
import { byDataTestId, ScenePart } from '@atomic-testing/core';

const signupScene = {
  email: { locator: byDataTestId('email-input'), driver: TextInputDriver },
  submit: { locator: byDataTestId('save-button'), driver: ButtonDriver },
} satisfies ScenePart;
```

Then drive it through `engine.parts` — semantic calls, not DOM queries:

```typescript
await engine.parts.email.setValue('user@example.com');
await engine.parts.submit.click();

expect(await engine.parts.submit.isDisabled()).toBe(false);
```

The same scene and the same test body run unchanged in a DOM test and an end-to-end test — only the engine creation differs:

```typescript
// DOM (Jest + React), via @atomic-testing/react-19
const domEngine = createTestEngine(<SignupForm />, signupScene);

// End-to-end (Playwright), via @atomic-testing/playwright
const e2eEngine = createTestEngine(page, signupScene);
```

For a larger, driver-per-component version of this pattern, see the real suites under [`package-tests/component-driver-astryx-test/src/examples`](https://github.com/atomic-testing/atomic-testing/tree/main/package-tests/component-driver-astryx-test/src/examples) — every driver in the tables below has a matching `*.suite.ts` there, run against both a `.dom.test.ts` (Jest) and an `.e2e.test.ts` (Playwright) adapter, so the DOM/E2E parity above is exercised on every driver in this package, not just the example.

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

Wave 2 — overlays & menus. Astryx renders these **in-tree** (no portal): menus and
popovers mount their panel as a sibling of the trigger via the native Popover API,
and dialogs are native `<dialog>` elements. Each driver anchors on the trigger (or
the `<dialog>`) and reads open state from `aria-expanded` or the `<dialog>` `open`
attribute; panel visibility and `Escape`/backdrop dismissal are native behaviours
covered only by the Playwright run (and skipped on WebKit, which cannot drive
native-popover interactions). Anchoring rationale lives in each driver's source doc
comment.

### Menus & navigation

| Driver               | Astryx component | Notes                                                                            |
| -------------------- | ---------------- | -------------------------------------------------------------------------------- |
| `NavMenuDriver`      | `NavHeadingMenu` | Flat link/action menu; `getItemLabels`/`getItemCount`/`clickItem`/`getItemHref`. |
| `DropdownMenuDriver` | `DropdownMenu`   | Trigger-anchored; `open`/`close`/`isOpen`, `selectByLabel`, `getTriggerLabel`.   |
| `MoreMenuDriver`     | `MoreMenu`       | Icon-only `DropdownMenu`; `getTriggerLabel` reads the `aria-label`.              |
| `TabListDriver`      | `TabList`        | `getItemLabels`/`getActiveLabel`/`selectTab`/`isActive`/`getTabHref`.            |
| `TabDriver`          | `Tab`            | A single tab: `getLabel`/`isActive` (`aria-current="page"`)/`getHref`.           |
| `ToolbarDriver`      | `Toolbar`        | `getLabel`/`getOrientation`/`getSize`/`getItemCount`.                            |
| `AstryxMenuDriver`   | —                | Shared menu base (positional `role="menuitem"` iteration).                       |
| `MenuItemDriver`     | —                | A single `role="menuitem"` (`<a>`/`<div>`): `getLabel`/`isDisabled`/`getHref`.   |

### Overlays & feedback

| Driver              | Astryx component | Notes                                                                            |
| ------------------- | ---------------- | -------------------------------------------------------------------------------- |
| `PopoverDriver`     | `Popover`        | Trigger-anchored; `open`/`close`/`isOpen`, `getLabel`/`getContent`.              |
| `DialogDriver`      | `Dialog`         | Native `<dialog>`; `isOpen`/`isModal`/`getTitle`/`closeByEscape`; content parts. |
| `AlertDialogDriver` | `AlertDialog`    | `role="alertdialog"`; `getTitle`/`getDescription`, `clickAction`/`clickCancel`.  |
| `ToastDriver`       | `Toast`          | Stable `data-type`: `getType`/`isError`/`getRole`/`getMessage`, `dismiss`.       |

Wave 3 — lists, tables, selectors & dates. The list/table/tree drivers read
structure from native semantics (`<li>`, `<table>`, `ul[role="tree"]`) and per-row
state from ARIA. The combobox family (Selector/MultiSelector/Typeahead/Tokenizer,
plus the CommandPalette dialog and PowerSearch's field suggestions) shares one
option-enumeration mechanism — options are addressed by their contiguous
`${listboxId}-${item|option}-${i}` ids — exposed through `AstryxComboboxDriver` (its
trigger open/close layer) over an internal `IndexedOptionListDriver` base. Popup and
calendar-popover visibility are native behaviours covered by the Playwright run;
structure and ARIA render faithfully in jsdom. Anchoring rationale and the
scroll/layout-only caveats (Carousel overflow, Outline scroll-spy) live in each
driver's source doc comment.

### Lists & display

| Driver               | Astryx component | Notes                                                                                        |
| -------------------- | ---------------- | -------------------------------------------------------------------------------------------- |
| `ListDriver`         | `List`           | `<li>`-addressed rows; `getItemLabels`/`getSelectedLabels`/`clickItem`/`isOrdered`.          |
| `ListItemDriver`     | —                | A single row: `getLabel` (full text), `isSelected`/`isDisabled` (ARIA), `isLink`/`getHref`.  |
| `MetadataListDriver` | `MetadataList`   | `<dl>` pairs; `getLabels`/`getValueByLabel`/`getEntryCount`, `showMore`/`showLess`.          |
| `OutlineDriver`      | `Outline`        | TOC nav; `getItemLabels`/`getActiveLabel` (`aria-current`)/`getHref`/`getLevel`/`clickItem`. |
| `OutlineItemDriver`  | —                | A single entry: `getLabel`/`getHref`/`getLevel` (`data-level`)/`isActive`.                   |
| `CarouselDriver`     | `Carousel`       | `getLabel`/`getItemCount`/`hasNavButtons`; `scrollNext`/`scrollPrev` are E2E-only.           |

### Tables & trees

| Driver           | Astryx component | Notes                                                                                                                                                   |
| ---------------- | ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `TableDriver`    | `Table`          | `data-column-key`/`aria-sort`/`aria-selected`; headers, data rows (empty-state row excluded), sort, row selection. `TableSortDirection` is re-exported. |
| `TreeListDriver` | `TreeList`       | `ul[role="tree"]` walked depth-first; `getVisibleItemLabels`/`getItemDepth`/`expandItem`/`collapseItem`/`clickItem`.                                    |

### Selectors, typeaheads & search

| Driver                 | Astryx component | Notes                                                                                                                                           |
| ---------------------- | ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `AstryxComboboxDriver` | —                | Shared combobox base: trigger `open`/`close`/`isExpanded` over the option-enumeration surface.                                                  |
| `SelectorDriver`       | `Selector`       | Single-select; `getOptionLabels`/`selectByLabel`/`getSelectedLabel`/`isOptionSelected`.                                                         |
| `MultiSelectorDriver`  | `MultiSelector`  | Multi-select; `toggleByLabel`/`getSelectedLabels` (excludes select-all)/`selectAll`/`clearAll`.                                                 |
| `TypeaheadDriver`      | `Typeahead`      | Search-as-you-type single-select; `type`/`getResultLabels`/`selectByLabel`/`clear`/`isLoading`.                                                 |
| `TokenizerDriver`      | `Tokenizer`      | Multi-token; `getTokenLabels`/`addByLabel`/`create`/`removeToken`/`clearAll`/`isLoading`.                                                       |
| `CommandPaletteDriver` | `CommandPalette` | Host-controlled `<dialog>`; `search`/`getOptionLabels`/`getOptionValue`/`selectByLabel`/`getActiveValue`.                                       |
| `PowerSearchDriver`    | `PowerSearch`    | **Best-effort v1**: `getFilterLabels`/`removeFilter`/`clearAll`/`getFieldSuggestionLabels`/`getResultCount` (in-popover edit is E2E/follow-up). |

### Dates

| Driver                 | Astryx component | Notes                                                                                                                       |
| ---------------------- | ---------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `CalendarDriver`       | `Calendar`       | Inline; `[data-date]` cells, `getMode`/`getVisibleMonthLabel`/`selectDay`/`selectRange`/`previousMonth`/`nextMonth`.        |
| `DateInputDriver`      | `DateInput`      | Input value + calendar popover; `open`/`pickDate` (via `aria-controls`)/`isInvalid`/`clear`.                                |
| `DateTimeInputDriver`  | `DateTimeInput`  | Extends `DateInputDriver` with a paired time field (`getTimeValue`/`setTime`).                                              |
| `DateRangeInputDriver` | `DateRangeInput` | **Best-effort v1**: popover `<dialog>` with presets + range `pickRange` (the end day is re-resolved after the start click). |

## Learn more

- [Astryx driver coverage guide](https://atomic-testing.dev/docs/driver-coverage/astryx-driver-coverage) — the per-wave coverage matrix behind the tables above.
- [atomic-testing.dev](https://atomic-testing.dev/) — full docs, guides, and the API reference.
- [#909](https://github.com/atomic-testing/atomic-testing/issues/909) — the umbrella issue tracking this package's driver waves.
