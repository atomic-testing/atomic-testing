# Module: component-driver-html (`@atomic-testing/component-driver-html`)

## Purpose

Drivers for native HTML elements. These are the lowest-level concrete drivers and the building blocks the MUI drivers compose (the mui packages import `HTMLButtonDriver`, `HTMLElementDriver`, etc.). Depends only on `@atomic-testing/core`.

## Public surface

Barrel: [component-driver-html/src/index.ts](../../packages/component-driver-html/src/index.ts).

| Driver                       | Targets                                      | Implements                                            |
| ---------------------------- | -------------------------------------------- | ----------------------------------------------------- |
| `HTMLElementDriver`          | any element (generic `div`/`span`/container) | `ComponentDriver<{}>`                                 |
| `HTMLAnchorDriver`           | `<a>`                                        | clickable link                                        |
| `HTMLButtonDriver`           | `<button>`                                   | `IClickableDriver`, `IMouseInteractableDriver`        |
| `HTMLTextInputDriver`        | `<input>` (text/date/time/etc.)              | `IInputDriver<string \| null>`                        |
| `HTMLTextAreaDriver`         | `<textarea>`                                 | `IInputDriver<string \| null>`                        |
| `HTMLSelectDriver`           | `<select>` (native)                          | `IInputDriver<Nullable<string \| readonly string[]>>` |
| `HTMLOptionDriver`           | `<option>`                                   | label/value reads                                     |
| `HTMLCheckboxDriver`         | `<input type=checkbox>`                      | toggle                                                |
| `HTMLCheckboxGroupDriver`    | a set of checkboxes                          | group selection                                       |
| `HTMLRadioButtonGroupDriver` | a set of radios                              | group selection                                       |
| `HTMLHiddenInputDriver`      | `<input type=hidden>`                        | value read                                            |
| `HTMLFileInputDriver`        | `<input type=file>`                          | `uploadFiles` (delegates to `setInputFiles`)          |

## Responsibilities

- Wrap a single native element/group with a semantic API.
- Delegate every operation to the injected `Interactor` (so they run unchanged in DOM/React/Vue/Playwright).

## Non-goals

- No framework-component knowledge (that's the MUI packages).
- No rendering — drivers operate on whatever the test engine resolves.

## How it works — the canonical driver pattern

A driver extends `ComponentDriver<parts>`, optionally implements a capability interface, passes `parts` to `super`, and implements `driverName`.

**Leaf input driver** — `HTMLTextInputDriver` ([HTMLTextInputDriver.ts](../../packages/component-driver-html/src/components/HTMLTextInputDriver.ts#L3-L54)):

```ts
export class HTMLTextInputDriver extends ComponentDriver<{}> implements IInputDriver<string | null> {
  constructor(locator, interactor, option?) {
    super(locator, interactor, { ...option, parts: {} });
  }
  async getValue() {
    return (await this.interactor.getInputValue(this.locator)) ?? null;
  }
  async setValue(v) {
    await this.interactor.enterText(this.locator, v ?? '');
    return true;
  }
  isDisabled() {
    return this.interactor.isDisabled(this.locator);
  }
  isReadonly() {
    return this.interactor.isReadonly(this.locator);
  }
  get driverName() {
    return 'HTMLTextInput';
  }
}
```

**Driver that iterates children** — `HTMLSelectDriver` ([HTMLSelectDriver.ts](../../packages/component-driver-html/src/components/HTMLSelectDriver.ts#L16-L116)): implements `IInputDriver`, plus `isMultiple`, `getValuesByLabels`, `selectByLabel`, `getSelectedLabel` (overloaded for single/multi). It iterates `<option>`s with `listHelper.getListItemIterator(this, append(locator, byTagName('option')), HTMLOptionDriver)` and reads each via `HTMLOptionDriver` ([L56-L68](../../packages/component-driver-html/src/components/HTMLSelectDriver.ts#L56-L68)).

**Pure capability driver** — `HTMLButtonDriver` implements `IClickableDriver`, `IMouseInteractableDriver` (inheriting `click`/`hover` from `ComponentDriver`) and adds `isDisabled` ([HTMLButtonDriver.ts](../../packages/component-driver-html/src/components/HTMLButtonDriver.ts#L3-L20)).

## Key types

Drivers extend `ComponentDriver` and implement contracts from [driverTypes.ts](../../packages/core/src/drivers/driverTypes.ts) — see [DOMAIN.md → Driver contracts](../DOMAIN.md#driver-contracts-mixins).

## Invariants & failure modes

- `setValue` on a date-typed input must use the documented format (`yyyy-MM-dd`, `HH:mm`, `yyyy-MM-ddTHH:mm`); the interactor validates and throws otherwise ([HTMLTextInputDriver.ts#L23-L32](../../packages/component-driver-html/src/components/HTMLTextInputDriver.ts#L23-L32), [DOMAIN.md invariants](../DOMAIN.md#invariants)).
- `HTMLSelectDriver.getValue` returns an array when the `<select multiple>`, else the first value, else `null` ([L31-L36](../../packages/component-driver-html/src/components/HTMLSelectDriver.ts#L31-L36)).

## Extension points — add an HTML driver

1. Create `src/components/HTMLXDriver.ts`, `extends ComponentDriver<{}>` (or declare `parts` if it has children).
2. Implement the relevant capability interface(s) and `driverName`.
3. Delegate to `this.interactor` / `this.parts`; reuse `listHelper` for repeated children.
4. Export from [index.ts](../../packages/component-driver-html/src/index.ts).

## Related files

- [HTMLSelectDriver.ts](../../packages/component-driver-html/src/components/HTMLSelectDriver.ts) — child-iteration example.
- [modules/core.md](core.md) — `ComponentDriver`, `listHelper`, locators.
- [adr/001-component-driver-pattern.md](../adr/001-component-driver-pattern.md) — the pattern's rationale.
