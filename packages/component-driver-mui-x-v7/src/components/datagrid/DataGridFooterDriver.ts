import { HTMLElementDriver } from '@atomic-testing/component-driver-html';
import {
  byCssClass,
  ComponentDriver,
  IComponentDriverOption,
  Interactor,
  Optional,
  PartLocator,
  ScenePart,
} from '@atomic-testing/core';

import { DataGridPaginationActionDriver } from './DataGridPaginationActionDriver';

const parts = {
  paginationAction: {
    locator: byCssClass('MuiTablePagination-actions'),
    driver: DataGridPaginationActionDriver,
  },
  paginationDescription: {
    locator: byCssClass('MuiTablePagination-displayedRows'),
    driver: HTMLElementDriver,
  },
} satisfies ScenePart;

/**
 * Driver for Material UI v6 DataGridPro component.
 * @see https://mui.com/x/react-data-grid/
 */
export class DataGridFooterDriver extends ComponentDriver<typeof parts> {
  constructor(locator: PartLocator, interactor: Interactor, option?: Partial<IComponentDriverOption>) {
    super(locator, interactor, {
      ...option,
      parts,
    });
  }

  async isPreviousPageEnabled(): Promise<boolean> {
    await this.enforcePartExistence('paginationAction');
    return this.parts.paginationAction.isPreviousPageEnabled();
  }

  async gotoPreviousPage(): Promise<void> {
    await this.enforcePartExistence('paginationAction');
    await this.parts.paginationAction.gotoPreviousPage();
  }

  async isNextPageEnabled(): Promise<boolean> {
    await this.enforcePartExistence('paginationAction');
    return this.parts.paginationAction.isNextPageEnabled();
  }

  async gotoNextPage(): Promise<void> {
    await this.enforcePartExistence('paginationAction');
    await this.parts.paginationAction.gotoNextPage();
  }

  async getPaginationDescription(): Promise<Optional<string>> {
    await this.enforcePartExistence('paginationDescription');
    return this.parts.paginationDescription.getText();
  }

  override get driverName(): string {
    return 'MuiV7DataGridFooterDriver';
  }
}
