import {
  byChecked,
  byValue,
  ComponentDriver,
  IInputDriver,
  LocatorRelativePosition,
  locatorUtil,
} from '@testzilla/core';

export class HTMLRadioButtonGroupDriver extends ComponentDriver<{}> implements IInputDriver<string | null> {
  async getValue(): Promise<string | null> {
    const checkedLocator = byChecked(true);
    const locator = locatorUtil.append(this.locator, checkedLocator);
    const value = await this.interactor.getAttribute(locator, 'value');
    return value ?? null;
  }

  async setValue(value: string | null): Promise<boolean> {
    if (value == null) {
      throw new Error('Cannot be done');
    }
    const valueLocator = byValue(value, LocatorRelativePosition.Same);
    const locator = locatorUtil.append(this.locator, valueLocator);
    await this.interactor.click(locator);
    return true;
  }

  get driverName(): string {
    throw 'HTMLRadioButtonGroupDriver';
  }
}
