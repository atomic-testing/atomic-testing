import { ComponentDriver, IComponentDriverOption, IInputDriver, IInteractor, LocatorChain } from '@atomic-testing/core';

export class HTMLHiddenInputDriver extends ComponentDriver<{}> implements IInputDriver<string | null> {
  constructor(locator: LocatorChain, interactor: IInteractor, option?: IComponentDriverOption) {
    super(locator, interactor, {
      ...option,
      parts: {},
    });
  }

  async getValue(): Promise<string | null> {
    const value = await this.interactor.getAttribute(this.locator, 'value');
    return value ?? null;
  }

  setValue(value: string | null): Promise<boolean> {
    // Setting value of a hidden input should not be part of user interaction
    throw new Error('Not implemented');
  }

  get driverName(): string {
    return 'HTMLHiddenInput';
  }
}
