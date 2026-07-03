import { HTMLButtonDriver } from '@atomic-testing/component-driver-html';
import { IToggleDriver } from '@atomic-testing/core';

/**
 * Driver for the Radix Toggle primitive (`Toggle.Root` from `radix-ui`).
 *
 * Renders a real `<button aria-pressed data-state="on"/"off">` — extending
 * `HTMLButtonDriver` inherits `isDisabled`/`click` off the native `disabled`
 * attribute Radix forwards, and only the pressed-state read/write is added.
 */
export class ToggleDriver extends HTMLButtonDriver implements IToggleDriver {
  async isSelected(): Promise<boolean> {
    return (await this.interactor.getAttribute(this.locator, 'data-state')) === 'on';
  }

  async setSelected(selected: boolean): Promise<void> {
    if ((await this.isSelected()) !== selected) {
      await this.interactor.click(this.locator);
    }
  }

  override get driverName(): string {
    return 'RadixV1ToggleDriver';
  }
}
