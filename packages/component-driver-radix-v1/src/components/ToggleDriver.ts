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

  /**
   * No-ops on a disabled toggle rather than clicking it regardless: under
   * jsdom, `userEvent.click` already silently skips a disabled native
   * `<button>`, but `PlaywrightInteractor.click`'s actionability check instead
   * retries "is enabled" until the click's own timeout — indistinguishable
   * from a hang for a control that can never become enabled. Checking
   * {@link isDisabled} (inherited from `HTMLButtonDriver`) first keeps the
   * no-op behavior identical across every `Interactor`.
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
    return 'RadixV1ToggleDriver';
  }
}
