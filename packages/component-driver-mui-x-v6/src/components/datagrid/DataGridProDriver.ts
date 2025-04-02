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
 * Driver for Material UI v6 DataGridPro component.
 * @see https://mui.com/x/react-data-grid/
 */
export class DataGridProDriver extends ComponentDriver<typeof parts> {
  constructor(locator: PartLocator, interactor: Interactor, option?: Partial<IComponentDriverOption>) {
    super(locator, interactor, {
      ...option,
      parts,
    });
  }

  /**
   * Checks if the data grid is currently loading.
   * @returns A promise that resolves to a boolean indicating if the data grid is loading.
   */
  async isLoading(): Promise<boolean> {
    const result = await Promise.all([this.parts.loading.isVisible()]);
    return result.some(v => v);
  }

  /**
   * Waits for the data grid to exit the loading state.
   * @param timeoutMs The maximum time to wait for the load to complete, in milliseconds.
   */
  async waitForLoad(timeoutMs: number = 10000): Promise<void> {
    await this.parts.headerRow.waitUntilComponentState();
    await this.waitUntil({ probeFn: () => this.isLoading(), terminateCondition: false, timeoutMs });
  }

  /**
   * The number of columns currently displayed in the data grid, note that data grid pro
   * uses virtualize rendering, therefore the column count heavily depends on the viewport size
   * @returns The number of columns currently displayed in the data grid
   */
  async getColumnCount(): Promise<number> {
    await this.waitForLoad();
    return this.parts.headerRow.getColumnCount();
  }

  /**
   * The array text of the header row, note that columns not shown in the viewport may not be included because of virtualize rendering
   * @returns The array of text of the header row
   */
  async getHeaderText(): Promise<string[]> {
    await this.waitForLoad();
    return this.parts.headerRow.getRowText();
  }

  /**
   * The number of rows currently displayed in the data grid, note that data grid pro
   * uses virtualize rendering, therefore the row count heavily depends on the viewport size
   * @returns The number of columns currently displayed in the data grid
   */
  async getRowCount(): Promise<number> {
    await this.waitForLoad();
    const gridRowLocator = locatorUtil.append(this.locator, dataRowLocator);
    let count = 0;
    for await (const _ of listHelper.getListItemIterator(this, gridRowLocator, HTMLElementDriver)) {
      count++;
    }
    return count;
  }

  /**
   * Return the row driver for the row at the specified index, if the row does not exist, return null
   * @param rowIndex
   * @returns
   */
  async getRow(rowIndex: number): Promise<DataGridHeaderRowDriver | null> {
    const rowLocator = locatorUtil.append(this.locator, byCssSelector(`[role=row][data-rowindex="${rowIndex}"]`));
    const rowExists = await this.interactor.exists(rowLocator);
    if (rowExists) {
      return new DataGridHeaderRowDriver(rowLocator, this.interactor, this.commutableOption);
    }

    return null;
  }

  /**
   * The array text of the specified row, note that columns not shown in the viewport may not be included because of virtualize rendering
   * @param rowIndex The index of the row
   * @returns The array of text of the specified row
   */
  async getRowText(rowIndex: number): Promise<string[]> {
    await this.waitForLoad();
    const row = await this.getRow(rowIndex);
    if (row != null) {
      return row.getRowText();
    }
    throw new Error(`Row ${rowIndex} does not exist`);
  }

  /**
   * Get the cell driver for the cell, if the cell does not exist, return null
   * The cell driver is default to HTMLElementDriver, you can specify a different driver class
   * @param query The query to locate the cell
   * @param driverClass Optional, the driver class to use for the cell, default to HTMLElementDriver
   * @returns
   */
  async getCell<DriverT extends ComponentDriver>(
    query: DataGridCellQuery,
    // @ts-ignore
    driverClass: typeof ComponentDriver = HTMLElementDriver
  ): Promise<DriverT | null> {
    await this.waitForLoad();
    const rowDriver = await this.getRow(query.rowIndex);

    if (rowDriver === null) {
      return null;
    }

    if ('columnIndex' in query) {
      return rowDriver.getCell(query.columnIndex, driverClass);
    }

    return rowDriver.getCell(query.columnField, driverClass);
  }

  /**
   * Get the text content of the cell, if the cell does not exist, throw an error
   * @param query The query to locate the cell
   * @returns
   */
  async getCellText(query: DataGridCellQuery): Promise<string> {
    const cell = await this.getCell(query);
    if (cell != null) {
      const text = await cell.getText();
      return text!;
    }

    //@ts-ignore
    throw new Error(`Cell at row:${query.rowIndex} column:${query.columnIndex ?? query.columnField} does not exist`);
  }

  override get driverName(): string {
    return 'MuiV6DataGridDriver';
  }
}
