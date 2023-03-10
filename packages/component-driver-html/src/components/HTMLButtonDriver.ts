import { ComponentDriver, IClickableDriver, IClickOption } from '@atomic-testing/core';

export class HTMLButtonDriver extends ComponentDriver<{}> implements IClickableDriver {
  async click(option?: IClickOption): Promise<void> {
    await this.interactor.click(this.locator, option);
  }

  isDisabled(): Promise<boolean> {
    return this.interactor.isDisabled(this.locator);
  }

  isReadonly(): Promise<boolean> {
    return this.interactor.isReadonly(this.locator);
  }

  get driverName(): string {
    return 'HTMLButtonDriver';
  }
}
