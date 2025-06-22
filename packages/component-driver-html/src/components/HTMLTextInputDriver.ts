import { ComponentDriver, IComponentDriverOption, IInputDriver, Interactor, PartLocator } from '@atomic-testing/core';

export class HTMLTextInputDriver extends ComponentDriver<{}> implements IInputDriver<string | null> {
  /**
   * Create a text input driver.
   */
  constructor(locator: PartLocator, interactor: Interactor, option?: Partial<IComponentDriverOption>) {
    super(locator, interactor, {
      ...option,
      parts: {},
    });
  }

  /**
   * Read the value of the input element.
   */
  async getValue(): Promise<string | null> {
    const value = await this.interactor.getInputValue(this.locator);
    return value ?? null;
  }

  /**
   * Set the value of the input, if the input is date, the value should be in the format of 'yyyy-MM-dd'.
   * If the input is time, the value should be in the format of 'HH:mm:'.
   * If the input is datetime-local, the value should be in the format of 'yyyy-MM-ddTHH:mm'.
   * @param value Value to be set.
   * @returns
   */
  async setValue(value: string | null): Promise<boolean> {
    await this.interactor.enterText(this.locator, value ?? '');
    return true;
  }

  /**
   * Check whether the text input is disabled.
   */
  isDisabled(): Promise<boolean> {
    return this.interactor.isDisabled(this.locator);
  }

  /**
   * Check whether the text input is read only.
   */
  isReadonly(): Promise<boolean> {
    return this.interactor.isReadonly(this.locator);
  }

  /**
   * Identifier for this driver.
   */
  get driverName(): string {
    return 'HTMLTextInput';
  }
}
