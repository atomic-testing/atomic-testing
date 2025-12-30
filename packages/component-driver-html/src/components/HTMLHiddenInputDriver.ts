import { ComponentDriver, IComponentDriverOption, IInputDriver, Interactor, PartLocator } from '@atomic-testing/core';

export class HTMLHiddenInputDriver extends ComponentDriver<{}> implements IInputDriver<string | null> {
  /**
   * Create a driver for a hidden input element.
   */
  constructor(locator: PartLocator, interactor: Interactor, option?: Partial<IComponentDriverOption>) {
    super(locator, interactor, {
      ...option,
      parts: {},
    });
  }

  /**
   * Retrieve the value attribute of the hidden input.
   */
  async getValue(): Promise<string | null> {
    const value = await this.interactor.getAttribute(this.locator, 'value');
    return value ?? null;
  }

  /**
   * Setting the value of a hidden input is not supported.
   */
  setValue(_value: string | null): Promise<boolean> {
    throw new Error('Setting value on hidden inputs is not supported as it does not represent user interaction');
  }

  /**
   * Identifier for this driver.
   */
  get driverName(): string {
    return 'HTMLHiddenInput';
  }
}
