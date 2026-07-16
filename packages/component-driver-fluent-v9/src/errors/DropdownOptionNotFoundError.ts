import { ComponentDriver, ItemNotFoundError } from '@atomic-testing/core';

export const DropdownOptionNotFoundErrorId = 'DropdownOptionNotFoundError';

export class DropdownOptionNotFoundError extends ItemNotFoundError {
  constructor(
    public readonly label: string,
    driver: ComponentDriver<any>
  ) {
    super(label, driver, `Cannot find dropdown option with label: ${label}`);
    this.name = DropdownOptionNotFoundErrorId;
  }
}
