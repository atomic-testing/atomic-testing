import { ComponentDriver } from '@atomic-testing/core';

/**
 * Generic HTML element driver for non-interactive elements
 */
export class HTMLElementDriver extends ComponentDriver<{}> {
  get driverName(): string {
    return 'HTMLElementDriver';
  }
}
