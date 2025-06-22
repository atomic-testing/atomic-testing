import { ComponentDriver, IClickableDriver, IMouseInteractableDriver } from '@atomic-testing/core';

export class HTMLButtonDriver extends ComponentDriver<{}> implements IClickableDriver, IMouseInteractableDriver {
  /**
   * Check if the button element is disabled.
   *
   * @returns A promise that resolves to `true` when the underlying
   * `disabled` attribute is present.
   */
  isDisabled(): Promise<boolean> {
    return this.interactor.isDisabled(this.locator);
  }

  /**
   * Identifier for this driver. Primarily used by debugging utilities.
   */
  get driverName(): string {
    return 'HTMLButtonDriver';
  }
}
