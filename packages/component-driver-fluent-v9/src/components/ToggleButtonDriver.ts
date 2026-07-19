import { IToggleDriver } from '@atomic-testing/core';

import { ButtonDriver } from './ButtonDriver';

/**
 * Driver for the Fluent v9 `ToggleButton` component.
 *
 * DOM audit (@fluentui/react-components@9.74.3): a native
 * `<button class="fui-Button fui-ToggleButton" aria-pressed="true|false">` —
 * same root as `Button`, plus the pressed state mirrored to `aria-pressed`
 * (there is no native "pressed" concept for a `<button>`, so ARIA is the only
 * portable read/write signal).
 */
export class ToggleButtonDriver extends ButtonDriver implements IToggleDriver {
  async isSelected(): Promise<boolean> {
    return (await this.interactor.getAttribute(this.locator, 'aria-pressed')) === 'true';
  }

  /**
   * No-ops on a disabled button rather than clicking it regardless: under
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
    return 'FluentV9ToggleButtonDriver';
  }
}
