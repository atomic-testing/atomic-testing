import { ComponentDriver, ItemNotFoundError } from '@atomic-testing/core';

export const BreadcrumbItemNotFoundErrorId = 'BreadcrumbItemNotFoundError';

export class BreadcrumbItemNotFoundError extends ItemNotFoundError {
  constructor(
    public readonly label: string,
    driver: ComponentDriver<any>
  ) {
    super(label, driver, `Cannot find breadcrumb item with label: ${label}`);
    this.name = BreadcrumbItemNotFoundErrorId;
  }
}
