import { ClickOption, ComponentDriver, IClickableDriver, IMouseInteractableDriver } from '@atomic-testing/core';

export class HTMLButtonDriver extends ComponentDriver<{}> implements IClickableDriver, IMouseInteractableDriver {
  async hover(): Promise<void> {
    this.interactor.hover(this.locator);
  }

  async click(option?: ClickOption): Promise<void> {
    await this.interactor.click(this.locator, option);
  }

  isDisabled(): Promise<boolean> {
    return this.interactor.isDisabled(this.locator);
  }

  get driverName(): string {
    return 'HTMLButtonDriver';
  }
}
