import {
  ComponentDriver,
  defaultStep,
  IComponentDriverOption,
  IInputDriver,
  IInteractor,
  LocatorChain,
} from '@testzilla/core';

export class HTMLHiddenInputDriver extends ComponentDriver<{}> implements IInputDriver<string | null> {
  constructor(locator: LocatorChain, interactor: IInteractor, option?: IComponentDriverOption) {
    super(locator, interactor, {
      perform: defaultStep,
      ...option,
      parts: {},
    });
  }

  async getValue(): Promise<string | null> {
    const value = await this.interactor.getAttribute(this.locator, 'value');
    return value ?? null;
  }

  async setValue(value: string | null): Promise<boolean> {
    await this.interactor.setAttribute(this.locator, 'value', value ?? '');
    return true;
  }

  get driverName(): string {
    return 'HTMLHiddenInput';
  }
}
