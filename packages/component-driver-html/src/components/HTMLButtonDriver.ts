import { ComponentDriver, IClickableDriver, IMouseInteractableDriver } from '@atomic-testing/core';

export class HTMLButtonDriver extends ComponentDriver<{}> implements IClickableDriver, IMouseInteractableDriver {
  isDisabled(): Promise<boolean> {
    return this.interactor.isDisabled(this.locator);
  }

  get driverName(): string {
    return 'HTMLButtonDriver';
  }
}
