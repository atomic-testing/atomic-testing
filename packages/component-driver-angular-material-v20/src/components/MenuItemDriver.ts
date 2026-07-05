import { ComponentDriver } from '@atomic-testing/core';

import { MenuItemDisabledError } from '../errors/MenuItemDisabledError';

/**
 * Driver for one `role="menuitem"` entry inside an open menu panel. Disabled
 * state is read from the `aria-disabled` attribute (Material also mirrors it
 * onto the native `disabled` attribute of the `<button mat-menu-item>` host).
 * Obtained through `MenuDriver.getMenuItemByLabel`/`getMenuItemByIndex` —
 * items only exist in the DOM while the menu is open.
 */
export class MenuItemDriver extends ComponentDriver {
  /**
   * The item's visible label (trimmed), or `null` when it has no text.
   */
  async label(): Promise<string | null> {
    const label = await this.getText();
    return label?.trim() || null;
  }

  async isDisabled(): Promise<boolean> {
    return (await this.interactor.getAttribute(this.locator, 'aria-disabled')) === 'true';
  }

  /**
   * Click the item to activate it (which closes the menu). Material silently
   * ignores clicks on a disabled item, so that case throws instead of leaving
   * the caller waiting for an activation that never happens.
   */
  override async click(): Promise<void> {
    if (await this.isDisabled()) {
      const label = await this.label();
      throw new MenuItemDisabledError(label ?? '', this);
    }
    await this.interactor.click(this.locator);
  }

  override get driverName(): string {
    return 'AngularMaterialV20MenuItemDriver';
  }
}
