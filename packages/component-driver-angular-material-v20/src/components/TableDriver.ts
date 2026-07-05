import { HTMLElementDriver } from '@atomic-testing/component-driver-html';
import {
  byCssSelector,
  byRole,
  IComponentDriverOption,
  Interactor,
  ListComponentDriver,
  ListComponentDriverSpecificOption,
  listHelper,
  locatorUtil,
  PartLocator,
} from '@atomic-testing/core';

import { TableRowDriver } from './TableRowDriver';

/**
 * A data row, whichever rendering variant the table uses. MatTable emits an
 * explicit `role="row"` on every row and `role="cell"` on every data/footer
 * cell of **both** variants (native `<tr>`/`<td>` included), so the ARIA
 * roles are the portable anchor:
 *
 * - `:has([role="cell"])` keeps header rows out — their cells are
 *   `role="columnheader"` — and the `*matNoDataRow` row too (its content gets
 *   no cell role).
 * - Footer rows (`mat-footer-row` / `tr[mat-footer-row]` — the public
 *   template selectors) are excluded explicitly, because at the ARIA level
 *   they are indistinguishable from data rows.
 */
const dataRowLocator: PartLocator = byCssSelector(
  '[role="row"]:has([role="cell"]):not(mat-footer-row, [mat-footer-row])'
);

export const defaultTableDriverOption: ListComponentDriverSpecificOption<TableRowDriver> = {
  itemClass: TableRowDriver,
  itemLocator: dataRowLocator,
};

type TableDriverOption = ListComponentDriverSpecificOption<TableRowDriver> & Partial<IComponentDriverOption>;

/**
 * Driver for the Angular Material table (`MatTable`).
 *
 * Locate it by the table host — the native `<table mat-table>` or the flex
 * `<mat-table>` (e.g. a `data-testid` placed there). Both variants expose the
 * same ARIA contract (`role="table"`, `role="row"`, `role="columnheader"`,
 * `role="cell"` — the CDK sets these explicitly on the native elements too),
 * so one driver serves both; `role="grid"`/`treegrid` tables (whose cells are
 * `gridcell`) are out of scope, as are `MatSort`/`MatPaginator` (follow-up
 * work).
 *
 * Rows are the `ListComponentDriver` items: `getItemCount`/`getItemByIndex`/
 * `getItems` are inherited, with `getRowCount`/`getRowByIndex` as the
 * table-vocabulary aliases. Column-addressed reads resolve the column index
 * through the header row's `role="columnheader"` cell texts.
 *
 * @see https://material.angular.dev/components/table
 */
export class TableDriver extends ListComponentDriver<TableRowDriver> {
  constructor(locator: PartLocator, interactor: Interactor, option?: Partial<TableDriverOption>) {
    super(locator, interactor, { ...defaultTableDriverOption, ...option });
  }

  private get headerCellsLocator(): PartLocator {
    return locatorUtil.append(this.locator, byRole('columnheader'));
  }

  /**
   * The trimmed text of every `role="columnheader"` cell, in column order.
   * Assumes the single header row MatTable renders for one `*matHeaderRowDef`;
   * with multiple header rows the lists concatenate in DOM order.
   */
  async getColumnHeaders(): Promise<string[]> {
    const headers: string[] = [];
    for await (const cell of listHelper.getListItemIterator(this, this.headerCellsLocator, HTMLElementDriver)) {
      headers.push((await cell.getText())?.trim() ?? '');
    }
    return headers;
  }

  /**
   * The zero-based index of the column whose header text equals `header`
   * (trimmed), or `-1` when no column matches — `Array.prototype.findIndex`
   * semantics.
   */
  async getColumnIndex(header: string): Promise<number> {
    const headers = await this.getColumnHeaders();
    return headers.indexOf(header);
  }

  /**
   * The number of data rows (header, footer and `*matNoDataRow` rows never
   * count).
   */
  async getRowCount(): Promise<number> {
    return this.getItemCount();
  }

  /**
   * The driver of the data row at the given zero-based index, or `null` when
   * the index is out of range.
   */
  async getRowByIndex(rowIndex: number): Promise<TableRowDriver | null> {
    return this.getItemByIndex(rowIndex);
  }

  /**
   * The trimmed text of one cell, addressed by data-row index and column —
   * either the zero-based column index or the column's header text. Returns
   * `null` when the row, the column index, or the header text does not exist.
   */
  async getCellText(rowIndex: number, column: number | string): Promise<string | null> {
    const columnIndex = typeof column === 'number' ? column : await this.getColumnIndex(column);
    if (columnIndex < 0) {
      return null;
    }
    const row = await this.getRowByIndex(rowIndex);
    if (row == null) {
      return null;
    }
    return row.getCellText(columnIndex);
  }

  override get driverName(): string {
    return 'AngularMaterialV20TableDriver';
  }
}
