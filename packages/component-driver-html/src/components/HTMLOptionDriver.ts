import { ComponentDriver } from '@atomic-testing/core';

export class HTMLOptionDriver extends ComponentDriver {
  async label(): Promise<string | null> {
    const label = await this.getText();
    return label?.trim() || null;
  }

  async value(): Promise<string | null> {
    const val = (await this.interactor.getAttribute(this.locator, 'value')) ?? (await this.label());
    return val?.trim() || null;
  }

  get driverName(): string {
    return 'HTMLOptionDriver';
  }
}
