import { ComponentDriver, ItemNotFoundError } from '@atomic-testing/core';

export const MenuItemNotFoundErrorId = 'MenuItemNotFoundError';

/**
 * Thrown when a label-based lookup (`selectByLabel` on a `DropdownMenuDriver`
 * or `SelectDriver`) finds no matching item. Shared by both drivers, ported
 * from `component-driver-radix-v1`'s identical error.
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
