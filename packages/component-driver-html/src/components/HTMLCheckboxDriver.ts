import { ComponentDriver, IFormFieldDriver, IToggleDriver } from '@atomic-testing/core';

export class HTMLCheckboxDriver extends ComponentDriver<{}> implements IFormFieldDriver<string | null>, IToggleDriver {
  /**
   * Read the checkbox value attribute.
   *
   * @returns The value assigned to the checkbox or `null` when the attribute is
   * not present.
   */
  async getValue(): Promise<string | null> {
    const value = await this.interactor.getAttribute(this.locator, 'value');
    return value ?? null;
  }

  /**
   * Determine if the checkbox is currently checked.
   */
  async isSelected(): Promise<boolean> {
    const isChecked = await this.interactor.isChecked(this.locator);
    return isChecked;
  }

  /**
   * Change the checked state of the checkbox.
   *
   * @param selected Desired checked state.
   */
  async setSelected(selected: boolean): Promise<void> {
    const currentSelected = await this.isSelected();
    if (currentSelected !== selected) {
      await this.interactor.click(this.locator);
    }
  }

  /**
   * Check whether the checkbox element is disabled.
   */
  isDisabled(): Promise<boolean> {
    return this.interactor.isDisabled(this.locator);
  }

  /**
   * Check whether the checkbox is read only.
   */
  isReadonly(): Promise<boolean> {
    return this.interactor.isReadonly(this.locator);
  }

  /**
   * Identifier for this driver.
   */
  get driverName(): string {
    return 'HTMLCheckboxDriver';
  }
}
