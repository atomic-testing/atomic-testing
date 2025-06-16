import { ComponentDriver, ErrorBase } from '@atomic-testing/core';

export const MenuItemDisabledErrorId = 'MenuItemDisabledError';

function getErrorMessage(label: string): string {
  return `The menu item with label: ${label} is disabled`;
}

export class MenuItemDisabledError extends ErrorBase {
  constructor(
    public readonly label: string,
    public readonly driver: ComponentDriver
  ) {
    super(getErrorMessage(label), driver);
    this.name = MenuItemDisabledErrorId;
  }
}
