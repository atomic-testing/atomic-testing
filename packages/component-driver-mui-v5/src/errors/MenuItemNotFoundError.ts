import { ComponentDriver, ErrorBase } from '@atomic-testing/core';

export const MenuItemNotFoundErrorId = 'MenuItemNotFoundError';

function getErrorMessage(label: string): string {
  return `Cannot find menu item with label: ${label}`;
}

export class MenuItemNotFoundError extends ErrorBase {
  constructor(public readonly label: string, public readonly driver: ComponentDriver<any>) {
    super(getErrorMessage(label), driver);
    this.name = MenuItemNotFoundErrorId;
  }
}
