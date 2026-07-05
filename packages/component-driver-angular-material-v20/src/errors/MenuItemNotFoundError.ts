import { ComponentDriver, ItemNotFoundError } from '@atomic-testing/core';

export const MenuItemNotFoundErrorId = 'MenuItemNotFoundError';

/**
 * Thrown when a label-based selection (`MenuDriver.selectByLabel`,
 * `SelectDriver.selectByLabel`) finds no item with the requested label —
 * mirrors the mui-v7 error of the same name.
 */
export class MenuItemNotFoundError extends ItemNotFoundError {
  constructor(
    public readonly label: string,
    driver: ComponentDriver<any>
  ) {
    super(label, driver, `Cannot find menu item with label: ${label}`);
    this.name = MenuItemNotFoundErrorId;
  }
}
