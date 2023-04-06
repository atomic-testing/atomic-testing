import { ComponentDriver } from '@atomic-testing/core';

import { MenuItemDisabledError } from '../errors/MenuItemDisabledError';

// Mui-selected
// aria-selected="true"

export class MenuItemDriver extends ComponentDriver {
  async label(): Promise<string | null> {
    const label = await this.getText();
    return label?.trim() || null;
  }

  async isSelected(): Promise<boolean> {
    return await this.interactor.hasCssClass(this.locator, 'Mui-selected');
  }

  async isDisabled(): Promise<boolean> {
    const disabledVal = await this.interactor.getAttribute(this.locator, 'aria-disabled');
    return disabledVal === 'true';
  }

  async click(): Promise<void> {
    if (await this.isDisabled()) {
      const label = await this.label();
      throw new MenuItemDisabledError(label ?? '');
    }
    await this.interactor.click(this.locator);
  }

  get driverName(): string {
    return 'MuiV5MenuItemDriver';
  }
}
