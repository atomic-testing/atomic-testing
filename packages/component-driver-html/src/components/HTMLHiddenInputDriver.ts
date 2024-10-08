import { ComponentDriver, IComponentDriverOption, IInputDriver, Interactor, PartLocator } from '@atomic-testing/core';

export class HTMLHiddenInputDriver extends ComponentDriver<{}> implements IInputDriver<string | null> {
  constructor(locator: PartLocator, interactor: Interactor, option?: Partial<IComponentDriverOption>) {
    super(locator, interactor, {
      ...option,
      parts: {},
    });
  }

  async getValue(): Promise<string | null> {
    const value = await this.interactor.getAttribute(this.locator, 'value');
    return value ?? null;
  }

  setValue(_value: string | null): Promise<boolean> {
    // Setting value of a hidden input should not be part of user interaction
    throw new Error('Not implemented');
  }

  get driverName(): string {
    return 'HTMLHiddenInput';
  }
}
