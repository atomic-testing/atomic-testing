import { ComponentDriver, ItemNotFoundError } from '@atomic-testing/core';

export const MenuItemNotFoundErrorId = 'MenuItemNotFoundError';

export class MenuItemNotFoundError extends ItemNotFoundError {
  constructor(
    public readonly label: string,
    driver: ComponentDriver<any>
  ) {
    super(label, driver, `Cannot find menu item with label: ${label}`);
    this.name = MenuItemNotFoundErrorId;
  }
}
