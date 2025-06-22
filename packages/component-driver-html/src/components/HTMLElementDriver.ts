import { ComponentDriver } from '@atomic-testing/core';

/**
 * Generic HTML element driver for non-interactive elements
 */
export class HTMLElementDriver extends ComponentDriver<{}> {
  /**
   * Identifier for this driver.
   */
  get driverName(): string {
    return 'HTMLElementDriver';
  }
}
