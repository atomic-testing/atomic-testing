import { IToggleDriver } from '@atomic-testing/core';

import { ButtonDriver } from './ButtonDriver';

/**
 * Driver for the Astryx ToggleButton (`@astryxdesign/core/ToggleButton`).
 *
 * ToggleButton renders a native `<button>` that reports its on/off state through
 * `aria-pressed` and always sets an explicit `aria-label` (so `getLabel` is
 * reliable even though the visible text is duplicated for width reservation).
 * Selection is toggled by clicking — mirrors the MUI `ToggleButtonDriver`.
 */
export class ToggleButtonDriver extends ButtonDriver implements IToggleDriver {
  /** Whether the toggle is pressed (`aria-pressed="true"`). */
  async isSelected(): Promise<boolean> {
    return (await this.interactor.getAttribute(this.locator, 'aria-pressed')) === 'true';
  }

  /**
   * Click to reach `selected` when not already there.
   *
   * No-ops on a disabled button rather than clicking it regardless: under
   * jsdom, `userEvent.click` already silently skips a disabled native
   * `<button>`, but `PlaywrightInteractor.click`'s actionability check instead
   * retries "is enabled" until the click's own timeout — indistinguishable
   * from a hang for a control that can never become enabled. Checking
   * {@link isDisabled} first keeps the no-op behavior identical across every
   * `Interactor`.
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
    return 'AstryxToggleButtonDriver';
  }
}
