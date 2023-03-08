import {
  byValue,
  collectionUtil,
  ComponentDriver,
  IInputDriver,
  LocatorRelativePosition,
  locatorUtil,
} from '@testzilla/core';

import { HTMLCheckboxDriver } from './HTMLCheckboxDriver';

export class HTMLCheckboxGroupDriver extends ComponentDriver<{}> implements IInputDriver<readonly string[]> {
  async getValue(): Promise<readonly string[]> {
    // Go through all the checkboes and return the values of those which are checked
    // We cannot just select checked checkboxes because Playwright/Cypress would error
    // out when no checkboxes are selected
    const availableValues = await this.interactor.getAttribute(this.locator, 'value', true);
    const value: string[] = [];
    for (const val of availableValues) {
      const itemLocator = byValue(val, LocatorRelativePosition.Same);
      const locator = locatorUtil.append(this.locator, itemLocator);
      const isChecked = await this.interactor.isChecked(locator);
      if (isChecked) {
        value.push(val);
      }
    }
    return value;
  }

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

  protected async setSelectedByValue(value: string, selected: boolean): Promise<void> {
    const itemLocator = byValue(value, LocatorRelativePosition.Same);
    const locator = locatorUtil.append(this.locator, itemLocator);
    const checkBoxDriver = new HTMLCheckboxDriver(locator, this.interactor);
    await checkBoxDriver.setSelected(selected);
  }

  get driverName(): string {
    return 'HTMLCheckboxGroupDriver';
  }
}
