import { ComponentDriver } from '@atomic-testing/core';

/**
 * Generic HTML element driver for non-interactive elements
 */
export class HTMLElementDriver extends ComponentDriver<{}> {
  async hover() {
    this.interactor.hover(this.locator);
  }

  get driverName(): string {
    return 'HTMLElementDriver';
  }
}
