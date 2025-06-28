import { byValue, collectionUtil, ComponentDriver, IInputDriver, locatorUtil } from '@atomic-testing/core';

import { HTMLCheckboxDriver } from './HTMLCheckboxDriver';

export class HTMLCheckboxGroupDriver extends ComponentDriver<{}> implements IInputDriver<readonly string[]> {
  /**
   * Retrieve the list of values currently selected within the group.
   *
   * Iterates over every checkbox rather than relying on a CSS selector so that
   * an empty selection does not cause a driver error.
   */
  async getValue(): Promise<readonly string[]> {
    const availableValues = await this.interactor.getAttribute(this.locator, 'value', true);
    const value: string[] = [];
    for (const val of availableValues) {
      const itemLocator = byValue(val, 'Same');
      const locator = locatorUtil.append(this.locator, itemLocator);
      const isChecked = await this.interactor.isChecked(locator);
      if (isChecked) {
        value.push(val);
      }
    }
    return value;
  }

  /**
   * Select or deselect checkboxes so that their combined values equal the
   * provided list.
   *
   * @param values Values that should be selected after the operation.
   * @returns Always resolves to `true` once the selection has been adjusted.
   */
  async setValue(values: readonly string[]): Promise<boolean> {
    const currentValues = await this.getValue();
    const { toAdd, toRemove } = collectionUtil.getDifference<string>(currentValues, values);
    for (const val of toAdd) {
      await this.setSelectedByValue(val, true);
    }

    for (const val of toRemove) {
      await this.setSelectedByValue(val, false);
    }
    return true;
  }

  /**
   * Helper used by {@link setValue} to change the checked state of a checkbox
   * with a specific value.
   */
  protected async setSelectedByValue(value: string, selected: boolean): Promise<void> {
    const itemLocator = byValue(value, 'Same');
    const locator = locatorUtil.append(this.locator, itemLocator);
    const checkBoxDriver = new HTMLCheckboxDriver(locator, this.interactor);
    await checkBoxDriver.setSelected(selected);
  }

  /**
   * Identifier for this driver.
   */
  get driverName(): string {
    return 'HTMLCheckboxGroupDriver';
  }
}
