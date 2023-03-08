import { ComponentDriver, IClickableDriver, IClickOption } from '@atomic-testing/core';

export class HTMLButtonDriver extends ComponentDriver<{}> implements IClickableDriver {
  async click(option?: IClickOption): Promise<void> {
    await this.interactor.click(this.locator, option);
  }

  get driverName(): string {
    return 'HTMLButtonDriver';
  }
}
