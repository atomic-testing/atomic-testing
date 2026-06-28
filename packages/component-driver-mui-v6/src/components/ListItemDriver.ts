import { ComponentDriver } from '@atomic-testing/core';

import { MenuItemDisabledError } from '../errors/MenuItemDisabledError';

/**
 * @internal
 */
export class ListItemDriver extends ComponentDriver {
  async label(): Promise<string | null> {
    const label = await this.getText();
    return label?.trim() || null;
  }

  async isSelected(): Promise<boolean> {
    return await this.interactor.hasCssClass(this.locator, 'Mui-selected');
  }

  async isDisabled(): Promise<boolean> {
    // A disabled list item can surface its state three ways depending on how it
    // renders: a default `<ListItemButton>` is a `<div role="button">` with
    // `aria-disabled="true"`, while `<ListItemButton component="button">` is a native
    // `<button disabled>` (no `aria-disabled`). Both also carry the `Mui-disabled`
    // class, so check all three to avoid reporting a visibly disabled item as enabled.
    const [ariaDisabled, hasDisabledClass, disabledAttr] = await Promise.all([
      this.interactor.getAttribute(this.locator, 'aria-disabled'),
      this.interactor.hasCssClass(this.locator, 'Mui-disabled'),
      this.interactor.getAttribute(this.locator, 'disabled'),
    ]);
    return ariaDisabled === 'true' || hasDisabledClass || disabledAttr != null;
  }

  async click(): Promise<void> {
    if (await this.isDisabled()) {
      const label = await this.label();
      throw new MenuItemDisabledError(label ?? '', this);
    }
    await this.interactor.click(this.locator);
  }

  get driverName(): string {
    return 'MuiV6ListItemDriver';
  }
}
