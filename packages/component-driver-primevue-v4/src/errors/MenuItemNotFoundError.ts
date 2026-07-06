import { ComponentDriver, ItemNotFoundError } from '@atomic-testing/core';

export const MenuItemNotFoundErrorId = 'MenuItemNotFoundError';

/**
 * Thrown when a label-based lookup (`selectByLabel` on a `MenuDriver` or
 * `SelectDriver`) finds no matching item. Shared by both drivers, mirroring
 * the Radix and MUI packages' reuse of one error for their menu and select
 * drivers — both are "find the labelled item in an open list" operations.
 */
export class MenuItemNotFoundError extends ItemNotFoundError {
  constructor(
    public readonly label: string,
    driver: ComponentDriver<any>
  ) {
    super(label, driver, `Cannot find item with label: ${label}`);
    this.name = MenuItemNotFoundErrorId;
  }
}
