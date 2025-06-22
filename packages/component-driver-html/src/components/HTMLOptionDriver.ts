import { ComponentDriver } from '@atomic-testing/core';

export class HTMLOptionDriver extends ComponentDriver {
  /**
   * Text content of the option element.
   */
  async label(): Promise<string | null> {
    const label = await this.getText();
    return label?.trim() || null;
  }

  /**
   * Value attribute for the option element.
   *
   * When no explicit value is set, the trimmed label is returned.
   */
  async value(): Promise<string | null> {
    const val = (await this.interactor.getAttribute(this.locator, 'value')) ?? (await this.label());
    return val?.trim() || null;
  }

  /**
   * Identifier for this driver.
   */
  get driverName(): string {
    return 'HTMLOptionDriver';
  }
}
