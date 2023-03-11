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
    const isChecked = await this.interactor.isChecked(this.locator);
    return isChecked;
  }

  async setSelected(selected: boolean): Promise<void> {
    const currentSelected = await this.isSelected();
    if (currentSelected !== selected) {
      await this.interactor.click(this.locator);
    }
  }

  isDisabled(): Promise<boolean> {
    return this.interactor.isDisabled(this.locator);
  }

  isReadonly(): Promise<boolean> {
    return this.interactor.isReadonly(this.locator);
  }

  get driverName(): string {
    return 'HTMLCheckboxDriver';
  }
}
