import { HTMLElementDriver } from '@atomic-testing/component-driver-html';
import {
  byCssClass,
  byCssSelector,
  byRole,
  ComponentDriver,
  IComponentDriverOption,
  Interactor,
  listHelper,
  locatorUtil,
  PartLocator,
  ScenePart,
} from '@atomic-testing/core';

import { DataGridCellQuery } from './DataGridCellQuery';
import { DataGridHeaderRowDriver } from './DataGridHeaderRowDriver';

const parts = {
  headerRow: {
    locator: byCssClass('MuiDataGrid-columnHeaders').chain(byCssSelector('[role=row]:first-of-type')),
    driver: DataGridHeaderRowDriver,
  },
  loading: {
    locator: byRole('progressbar'),
    driver: HTMLElementDriver,
  },
} satisfies ScenePart;

const dataRowLocator = byCssSelector('[role=row][data-rowindex]');

/**
 * Driver for Material UI v5 DataGridPro component.
 * V5 DataGridPro component does not support data-testid, to use data-testid
 * to locate the component, you need to put the data-testid on the parent element of the grid
 * @see https://v5.mui.com/x/react-data-grid/
 */
export class DataGridProDriver extends ComponentDriver<typeof parts> {
  constructor(locator: PartLocator, interactor: Interactor, option?: Partial<IComponentDriverOption>) {
    super(locator, interactor, {
      ...option,
      parts,
    });
  }

  async waitForLoading(): Promise<void> {
    await this.parts.headerRow.waitUntil();
    await this.parts.loading.waitUntil({
      condition: 'detached',
    });
  }

  /**
   * The number of columns currently displayed in the data grid, note that data grid pro
   * uses virtualize rendering, therefore the column count heavily depends on the viewport size
   * @returns The number of columns currently displayed in the data grid
   */
  async getColumnCount(): Promise<number> {
    await this.waitForLoading();
    return this.parts.headerRow.getColumnCount();
  }

  /**
   * The number of rows currently displayed in the data grid, note that data grid pro
   * uses virtualize rendering, therefore the row count heavily depends on the viewport size
   * @returns The number of columns currently displayed in the data grid
   */
  async getRowCount(): Promise<number> {
    await this.waitForLoading();
    const gridRowLocator = locatorUtil.append(this.locator, dataRowLocator);
    let count = 0;
    for await (const _ of listHelper.getListItemIterator(this, gridRowLocator, HTMLElementDriver)) {
      count++;
    }
    return count;
  }

  async getCell<DriverT extends ComponentDriver>(
    query: DataGridCellQuery,
    // @ts-ignore
    driverClass: typeof ComponentDriver = HTMLElementDriver,
  ): Promise<DriverT | null> {
    const rowLocator = byCssSelector(`[role=row][data-rowindex="${query.rowIndex}"]`);
    let cellLocator: PartLocator;
    if ('columnIndex' in query) {
      cellLocator = byCssSelector(`[data-colindex="${query.columnIndex}"]`);
    } else {
      cellLocator = byCssSelector(`[data-field="${query.columnField}"]`);
    }
    const locator = locatorUtil.append(this.locator, rowLocator, cellLocator);
    const cellExists = await this.interactor.exists(locator);
    if (cellExists) {
      // @ts-ignore
      return new driverClass(locator, this.interactor, this.commutableOption);
    }

    return null;
  }

  override get driverName(): string {
    return 'MuiV5DataGridDriver';
  }
}
