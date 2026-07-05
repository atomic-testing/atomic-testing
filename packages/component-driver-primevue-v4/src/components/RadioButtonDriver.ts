import {
  byInputType,
  ComponentDriver,
  IDisableableDriver,
  IToggleDriver,
  locatorUtil,
  PartLocator,
} from '@atomic-testing/core';

/**
 * Driver for a single PrimeVue `RadioButton` component.
 *
 * DOM audit (primevue@4.5.5): the root is a styled
 * `<div data-pc-name="radiobutton" data-p-checked>` wrapping a REAL (visually
 * hidden) native `<input type="radio">` carrying `name`/`value`/`checked`/
 * `disabled` — so, as with {@link CheckboxDriver}, state reads and clicks go
 * through the native input rather than the styled box.
 *
 * `setSelected(false)` is rejected: a radio cannot deselect itself, only a
 * different item's selection can displace it (native radio semantics; same
 * contract as the Radix `RadioGroupItemDriver`). PrimeVue has no group
 * component — radios group by the native `name` attribute — so group-level
 * selection lives on {@link RadioButtonGroupDriver} over a consumer container.
 */
export class RadioButtonDriver extends ComponentDriver<{}> implements IToggleDriver, IDisableableDriver {
  private get inputLocator(): PartLocator {
    return locatorUtil.append(this.locator, byInputType('radio'));
  }

  /** Whether this radio is selected (native input `checked` property). */
  isSelected(): Promise<boolean> {
    return this.interactor.isChecked(this.inputLocator);
  }

  async setSelected(selected: boolean): Promise<void> {
    if (!selected) {
      throw new Error('A RadioButton cannot be deselected directly; select a different item instead.');
    }
    if (!(await this.isSelected())) {
      await this.interactor.click(this.inputLocator);
    }
  }

  /** Whether this radio is disabled (native `disabled` attribute on the input). */
  isDisabled(): Promise<boolean> {
    return this.interactor.isDisabled(this.inputLocator);
  }

  /** The `value` this radio represents (native `value` attribute on the input). */
  async getValue(): Promise<string | null> {
    return (await this.interactor.getAttribute(this.inputLocator, 'value')) ?? null;
  }

  get driverName(): string {
    return 'PrimeVueV4RadioButtonDriver';
  }
}
