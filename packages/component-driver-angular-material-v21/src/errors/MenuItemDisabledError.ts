import { ComponentDriver, ErrorBase } from '@atomic-testing/core';

export const MenuItemDisabledErrorId = 'MenuItemDisabledError';

/**
 * Thrown when clicking a disabled menu item or option. A real user's click on
 * a disabled item is silently ignored by Material, so a test that reaches one
 * almost certainly holds a wrong assumption — fail loudly instead of letting
 * the test time out waiting for a selection that never happens. Mirrors the
 * mui-v7 error of the same name.
 */
export class MenuItemDisabledError extends ErrorBase {
  constructor(
    public readonly label: string,
    public readonly driver: ComponentDriver<any>
  ) {
    super(`The menu item with label: ${label} is disabled`, driver);
    this.name = MenuItemDisabledErrorId;
  }
}
