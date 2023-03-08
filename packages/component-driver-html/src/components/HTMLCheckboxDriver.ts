import { ComponentDriver, IFormFieldDriver, IToggleDriver } from '@atomic-testing/core';

export class HTMLCheckboxDriver extends ComponentDriver<{}> implements IFormFieldDriver<string | null>, IToggleDriver {
  async getValue(): Promise<string | null> {
    const isChecked = await this.interactor.isChecked(this.locator);
    if (!isChecked) {
      return null;
    }

    const value = await this.interactor.getAttribute(this.locator, 'value');
    return value ?? null;
  }

  async isSelected(): Promise<boolean> {
    const val = await this.getValue();
    return val != null;
  }

  async setSelected(selected: boolean): Promise<void> {
    const currentSelected = await this.isSelected();
    if (currentSelected !== selected) {
      await this.interactor.click(this.locator);
    }
  }

  get driverName(): string {
    return 'HTMLCheckboxDriver';
  }
}
