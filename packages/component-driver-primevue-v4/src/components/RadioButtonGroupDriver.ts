import { childListHelper, ComponentDriver, IInputDriver } from '@atomic-testing/core';

import { RadioButtonDriver } from './RadioButtonDriver';

/**
 * CSS for a PrimeVue RadioButton root — PrimeVue's own structural marker
 * (`data-pc-name`), never a theme class.
 */
const radioButtonSelector = '[data-pc-name="radiobutton"]';

/**
 * Group driver over a consumer container of PrimeVue `RadioButton`s.
 *
 * PrimeVue ships no group component — radios group by the native `name`
 * attribute — so this driver roots at whatever container the scene wraps the
 * radios in (a fieldset, a div of label/radio rows, …) and offers the
 * group-by-value surface of `HTMLRadioButtonGroupDriver`/the Radix
 * `RadioGroupDriver`. Items are found by PrimeVue's `data-pc-name="radiobutton"`
 * root marker via `childListHelper` (with wrapper recursion), because radios
 * are routinely nested one level deep inside per-option label wrappers where a
 * flat `:nth-of-type` walk would silently truncate the list.
 */
export class RadioButtonGroupDriver extends ComponentDriver<{}> implements IInputDriver<string | null> {
  /** The selected radio's `value`, or `null` when none is selected. */
  async getValue(): Promise<string | null> {
    for await (const item of this.iterateItems()) {
      if (await item.isSelected()) {
        return item.getValue();
      }
    }
    return null;
  }

  /**
   * Select the radio whose `value` matches.
   * @returns `false` when no such radio exists or it is disabled.
   */
  async setValue(value: string | null): Promise<boolean> {
    if (value == null) {
      throw new Error('A radio group cannot be deselected; pass an item value.');
    }
    const item = await this.getItemByValue(value);
    if (item == null || (await item.isDisabled())) {
      return false;
    }
    await item.setSelected(true);
    return true;
  }

  /** The radio whose `value` matches, or `null` if none. */
  async getItemByValue(value: string): Promise<RadioButtonDriver | null> {
    for await (const item of this.iterateItems()) {
      if ((await item.getValue()) === value) {
        return item;
      }
    }
    return null;
  }

  /** Number of radios in the group. */
  async getItemCount(): Promise<number> {
    return childListHelper.countMatchingChildren(this.interactor, this.locator, radioButtonSelector, '*');
  }

  private iterateItems(): AsyncGenerator<RadioButtonDriver> {
    return childListHelper.iterateMatchingChildren(this, this.locator, radioButtonSelector, RadioButtonDriver, '*');
  }

  get driverName(): string {
    return 'PrimeVueV4RadioButtonGroupDriver';
  }
}
