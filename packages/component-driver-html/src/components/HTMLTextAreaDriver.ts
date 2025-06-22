import { HTMLTextInputDriver } from './HTMLTextInputDriver';

export class HTMLTextAreaDriver extends HTMLTextInputDriver {
  /**
   * Identifier for this driver.
   */
  override get driverName(): string {
    return 'HTMLTextArea';
  }
}
