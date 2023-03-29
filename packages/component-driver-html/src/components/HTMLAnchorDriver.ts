import { ClickOption, ComponentDriver, IClickableDriver } from '@atomic-testing/core';

export class HTMLAnchorDriver extends ComponentDriver<{}> implements IClickableDriver {
  async click(option?: ClickOption): Promise<void> {
    await this.interactor.click(this.locator, option);
  }

  get driverName(): string {
    return 'HTMLButtonDriver';
  }
}
