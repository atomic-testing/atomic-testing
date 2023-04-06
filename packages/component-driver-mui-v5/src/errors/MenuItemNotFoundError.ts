export const MenuItemNotFoundErrorId = 'MenuItemNotFoundError';

function getErrorMessage(label: string): string {
  return `Cannot find menu item with label: ${label}`;
}

export class MenuItemNotFoundError extends Error {
  constructor(public readonly label: string) {
    super(getErrorMessage(label));
    this.name = MenuItemNotFoundErrorId;
  }
}
