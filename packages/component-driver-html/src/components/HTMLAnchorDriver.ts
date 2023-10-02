import { ClickOption, ComponentDriver, IClickableDriver, Optional } from '@atomic-testing/core';

export class HTMLAnchorDriver extends ComponentDriver<{}> implements IClickableDriver {
  async click(option?: ClickOption): Promise<void> {
    await this.interactor.click(this.locator, option);
  }

  async getHref(): Promise<Optional<string>> {
    return this.interactor.getAttribute(this.locator, 'href');
  }

  async getTarget(): Promise<Optional<string>> {
    return this.interactor.getAttribute(this.locator, 'target');
  }

  get driverName(): string {
    return 'HTMLButtonDriver';
  }
}
