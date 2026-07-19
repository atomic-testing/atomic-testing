import {
  ComponentDriver,
  IDisableableDriver,
  IFormFieldDriver,
  IReadonlyableDriver,
  IToggleDriver,
} from '@atomic-testing/core';

export class HTMLCheckboxDriver
  extends ComponentDriver<{}>
  implements IFormFieldDriver<string | null>, IToggleDriver, IDisableableDriver, IReadonlyableDriver
{
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
   * No-ops on a disabled checkbox rather than clicking it regardless: under
   * jsdom, `userEvent.click` already silently skips a disabled native
   * `<input>`, but `PlaywrightInteractor.click`'s actionability check instead
   * retries "is enabled" until the click's own timeout — indistinguishable
   * from a hang for a control that can never become enabled. Checking
   * `isDisabled` first keeps the no-op behavior identical across every
   * `Interactor`.
   *
   * @param selected Desired checked state.
   */
  async setSelected(selected: boolean): Promise<void> {
    const currentSelected = await this.isSelected();
    if (currentSelected === selected) {
      return;
    }
    if (await this.isDisabled()) {
      return;
    }
    await this.interactor.click(this.locator);
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
