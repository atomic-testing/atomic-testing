import { ComponentDriver } from '@atomic-testing/core';

import { MenuItemDisabledError } from '../errors/MenuItemDisabledError';

/**
 * Driver for one `role="option"` entry (`<mat-option>`) inside an open select
 * panel. Selection and disabled state are read from the `aria-selected` /
 * `aria-disabled` attributes Material maintains on the option host. Obtained
 * through `SelectDriver.getOptionByLabel` — options only exist in the DOM
 * while the panel is open.
 */
export class OptionDriver extends ComponentDriver {
  /**
   * The option's visible label (trimmed), or `null` when it has no text.
   */
  async label(): Promise<string | null> {
    const label = await this.getText();
    return label?.trim() || null;
  }

  async isSelected(): Promise<boolean> {
    return (await this.interactor.getAttribute(this.locator, 'aria-selected')) === 'true';
  }

  async isDisabled(): Promise<boolean> {
    return (await this.interactor.getAttribute(this.locator, 'aria-disabled')) === 'true';
  }

  /**
   * Click the option to select it. Material silently ignores clicks on a
   * disabled option, so that case throws instead of leaving the caller
   * waiting for a selection that never happens.
   */
  override async click(): Promise<void> {
    if (await this.isDisabled()) {
      const label = await this.label();
      throw new MenuItemDisabledError(label ?? '', this);
    }
    await this.interactor.click(this.locator);
  }

  override get driverName(): string {
    return 'AngularMaterialV21OptionDriver';
  }
}
