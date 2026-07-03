import { ComponentDriver, ItemNotFoundError } from '@atomic-testing/core';

export const MenuItemNotFoundErrorId = 'MenuItemNotFoundError';

/**
 * Thrown when a label-based lookup (`selectByLabel` on a `DropdownMenuDriver`
 * or `SelectDriver`) finds no matching item. Shared by both drivers, mirroring
 * `component-driver-mui-v7`'s reuse of the same error for its `MenuDriver` and
 * `SelectDriver` — both are "find the labelled item in an open list" operations.
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
