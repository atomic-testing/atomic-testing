import { ComponentDriver, ItemNotFoundError } from '@atomic-testing/core';

export const NavItemNotFoundErrorId = 'NavItemNotFoundError';

export class NavItemNotFoundError extends ItemNotFoundError {
  constructor(
    public readonly label: string,
    driver: ComponentDriver<any>
  ) {
    super(label, driver, `Cannot find nav item with label: ${label}`);
    this.name = NavItemNotFoundErrorId;
  }
}
