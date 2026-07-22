import { HTMLButtonDriver } from '@atomic-testing/component-driver-html';
import { IToggleDriver } from '@atomic-testing/core';

/**
 * Driver for the Reka UI Toggle primitive (`Toggle` from `reka-ui`).
 *
 * DOM audit (reka-ui@2.10.1, SSR-rendered): a real `<button type="button"
 * aria-pressed data-state="on"/"off" disabled>` — byte-for-byte the same
 * contract as `component-driver-radix-v1`'s `ToggleDriver` — so extending
 * `HTMLButtonDriver` again inherits `isDisabled`/`click` off the native
 * `disabled` attribute, and only the pressed-state read/write is added.
 */
export class ToggleDriver extends HTMLButtonDriver implements IToggleDriver {
  async isSelected(): Promise<boolean> {
    return (await this.interactor.getAttribute(this.locator, 'data-state')) === 'on';
  }

  /**
   * No-ops on a disabled toggle rather than clicking it regardless — see
   * `SwitchDriver.setSelected` for why.
   */
  async setSelected(selected: boolean): Promise<void> {
    if ((await this.isSelected()) === selected) {
      return;
    }
    if (await this.isDisabled()) {
      return;
    }
    await this.interactor.click(this.locator);
  }

  override get driverName(): string {
    return 'RekaUiV2ToggleDriver';
  }
}
