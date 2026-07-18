import { ComponentDriver, IDisableableDriver, IToggleDriver } from '@atomic-testing/core';

/**
 * Driver for a single Radix RadioGroup item (`RadioGroup.Item`).
 *
 * Renders `<button role="radio">` (no native `<input type="radio">`) carrying
 * `aria-checked`/`data-state` (`checked`/`unchecked`). `setSelected(false)` is
 * rejected — a radio item cannot deselect itself, only a different item's
 * selection can displace it — mirroring native radio semantics.
 */
export class RadioGroupItemDriver extends ComponentDriver<{}> implements IToggleDriver, IDisableableDriver {
  async isSelected(): Promise<boolean> {
    return (await this.interactor.getAttribute(this.locator, 'data-state')) === 'checked';
  }

  /**
   * No-ops on a disabled radio item rather than clicking it regardless: under
   * jsdom, `userEvent.click` already silently skips a disabled native
   * `<button>`, but `PlaywrightInteractor.click`'s actionability check instead
   * retries "is enabled" until the click's own timeout — indistinguishable
   * from a hang for a control that can never become enabled. Checking
   * {@link isDisabled} first keeps the no-op behavior identical across every
   * `Interactor`.
   */
  async setSelected(selected: boolean): Promise<void> {
    if (!selected) {
      throw new Error('A RadioGroup item cannot be deselected directly; select a different item instead.');
    }
    if (await this.isSelected()) {
      return;
    }
    if (await this.isDisabled()) {
      return;
    }
    await this.interactor.click(this.locator);
  }

  isDisabled(): Promise<boolean> {
    return this.interactor.isDisabled(this.locator);
  }

  /** The `value` this item represents. */
  async getValue(): Promise<string | null> {
    return (await this.interactor.getAttribute(this.locator, 'value')) ?? null;
  }

  get driverName(): string {
    return 'RadixV1RadioGroupItemDriver';
  }
}
