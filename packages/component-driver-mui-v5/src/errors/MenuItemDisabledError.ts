export const MenuItemDisabledErrorId = 'MenuItemDisabledError';

function getErrorMessage(label: string): string {
  return `The menu item with label: ${label} is disabled`;
}

export class MenuItemDisabledError extends Error {
  constructor(public readonly label: string) {
    super(getErrorMessage(label));
    this.name = MenuItemDisabledErrorId;
  }
}
