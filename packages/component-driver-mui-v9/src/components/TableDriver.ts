import {
  byCssSelector,
  IComponentDriverOption,
  Interactor,
  ListComponentDriver,
  ListComponentDriverSpecificOption,
  locatorUtil,
  Optional,
  PartLocator,
} from '@atomic-testing/core';

import { TableRowDriver } from './TableRowDriver';

/** Reported sort state of a column, mirroring the `aria-sort` values MUI emits. */
export type TableSortDirection = 'ascending' | 'descending';

// Body rows are the iterated items; the header row is addressed separately.
const headerRowLocator: PartLocator = byCssSelector('.MuiTableHead-root .MuiTableRow-root');

/**
 * Body rows are located under `.MuiTableBody-root`, so header rows are never
 * mistaken for data rows.
 */
export const defaultTableDriverOption: ListComponentDriverSpecificOption<TableRowDriver> = {
  itemClass: TableRowDriver,
  itemLocator: byCssSelector('.MuiTableBody-root .MuiTableRow-root'),
};

type TableDriverOption<ItemT extends TableRowDriver> = ListComponentDriverSpecificOption<ItemT> &
  Partial<IComponentDriverOption<any>>;

// The nth header cell (1-based for nth-of-type); header cells are `<th>` siblings.
function headerCellAt(columnIndex: number): PartLocator {
  return byCssSelector(`.MuiTableHead-root .MuiTableRow-root .MuiTableCell-root:nth-of-type(${columnIndex + 1})`);
}

/**
 * Driver for the Material UI v9 Table component.
 *
 * A {@link ListComponentDriver} over the data rows (`.MuiTableBody-root > .MuiTableRow-root`),
 * exposing per-row {@link TableRowDriver}s plus header reads and column sort state.
 * Locators key off MUI's structural classes (`MuiTableHead/Body/Row/Cell-root`),
 * which are stable across v9. Sort state is read from the header cell's `aria-sort`
 * and driven by clicking its `TableSortLabel`.
 * @see https://mui.com/material-ui/react-table/
 */
export class TableDriver<ItemT extends TableRowDriver = TableRowDriver> extends ListComponentDriver<ItemT> {
  constructor(locator: PartLocator, interactor: Interactor, option: Partial<TableDriverOption<ItemT>> = {}) {
    super(locator, interactor, {
      ...defaultTableDriverOption,
      ...option,
    } as TableDriverOption<ItemT>);
  }

  /**
   * The number of data (body) rows.
   */
  async getRowCount(): Promise<number> {
    return this.getItemCount();
  }

  /**
   * The data-row driver at the given zero-based index, or `null` when out of range.
   */
  async getRow(index: number): Promise<ItemT | null> {
    return this.getItemByIndex(index);
  }

  /**
   * The header row as a {@link TableRowDriver}, or `null` when the table has no header.
   */
  async getHeaderRow(): Promise<TableRowDriver | null> {
    const locator = locatorUtil.append(this.locator, headerRowLocator);
    if (!(await this.interactor.exists(locator))) {
      return null;
    }
    return new TableRowDriver(locator, this.interactor);
  }

  /**
   * The number of columns, derived from the header cell count (0 when no header).
   */
  async getColumnCount(): Promise<number> {
    const header = await this.getHeaderRow();
    return header == null ? 0 : header.getCellCount();
  }

  /**
   * The header cell texts, in column order (empty when no header).
   */
  async getHeaderTexts(): Promise<string[]> {
    const header = await this.getHeaderRow();
    return header == null ? [] : header.getCellTexts();
  }

  /**
   * The text of the data cell at the given row/column, or `undefined` when either
   * index is out of range.
   */
  async getCellText(rowIndex: number, columnIndex: number): Promise<Optional<string>> {
    const row = await this.getRow(rowIndex);
    if (row == null) {
      return undefined;
    }
    const cell = await row.getCell(columnIndex);
    if (cell == null) {
      return undefined;
    }
    return (await cell.getText())?.trim();
  }

  /**
   * The sort direction applied to the column at `columnIndex`, read from the header
   * cell's `aria-sort`, or `undefined` when that column is not the sorted one.
   */
  async getSortDirection(columnIndex: number): Promise<Optional<TableSortDirection>> {
    const cell = headerCellAt(columnIndex);
    const fullLocator = locatorUtil.append(this.locator, cell);
    if (!(await this.interactor.exists(fullLocator))) {
      return undefined;
    }
    const ariaSort = await this.interactor.getAttribute(fullLocator, 'aria-sort');
    return ariaSort === 'ascending' || ariaSort === 'descending' ? ariaSort : undefined;
  }

  /**
   * Toggle/apply sorting on the column at `columnIndex` by clicking its
   * `TableSortLabel`.
   * @returns `false` when the column has no sort control.
   */
  async sortByColumn(columnIndex: number): Promise<boolean> {
    const sortLabel = locatorUtil.append(
      this.locator,
      byCssSelector(
        `.MuiTableHead-root .MuiTableRow-root .MuiTableCell-root:nth-of-type(${columnIndex + 1}) .MuiTableSortLabel-root`
      )
    );
    if (!(await this.interactor.exists(sortLabel))) {
      return false;
    }
    await this.interactor.click(sortLabel);
    return true;
  }

  override get driverName(): string {
    return 'MuiV9TableDriver';
  }
}
