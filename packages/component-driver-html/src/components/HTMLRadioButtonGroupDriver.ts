import {
  byChecked,
  byValue,
  ComponentDriver,
  IInputDriver,
  LocatorRelativePosition,
  locatorUtil,
} from '@atomic-testing/core';

export class HTMLRadioButtonGroupDriver extends ComponentDriver<{}> implements IInputDriver<string | null> {
  /**
   * Get the value of the currently selected radio button in the group.
   */
  async getValue(): Promise<string | null> {
    const checkedLocator = byChecked(true);
    const locator = locatorUtil.append(this.locator, checkedLocator);
    const value = await this.interactor.getAttribute(locator, 'value');
    return value ?? null;
  }

  /**
   * Select the radio button with the specified value.
   *
   * @param value Value attribute of the radio button to select.
   */
  async setValue(value: string | null): Promise<boolean> {
    if (value == null) {
      throw new Error('Cannot be done');
    }
    const valueLocator = byValue(value, LocatorRelativePosition.Same);
    const locator = locatorUtil.append(this.locator, valueLocator);
    await this.interactor.click(locator);
    return true;
  }

  /**
   * Identifier for this driver.
   */
  get driverName(): string {
    return 'HTMLRadioButtonGroupDriver';
  }
}
