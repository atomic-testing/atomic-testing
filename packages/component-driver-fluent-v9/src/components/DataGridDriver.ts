import {
  byCssSelector,
  IComponentDriverOption,
  Interactor,
  ListComponentDriver,
  ListComponentDriverSpecificOption,
  locatorUtil,
  Optional,
  PartLocator,
  type PressKeyOption,
} from '@atomic-testing/core';

import { DataGridHeaderRowDriver } from './DataGridHeaderRowDriver';
import { DataGridRowDriver } from './DataGridRowDriver';
import type { TableSortDirection } from './TableHeaderCellDriver';

// DOM audit (@fluentui/react-table@9.19.17): DataGrid forces `noNativeElements:
// true` internally, so `DataGridBody`/`DataGridHeader` render `<div
// role="rowgroup">` and rows render `<div role="row">` — but `role="rowgroup"`
// is shared by BOTH the header and body wrappers (verified in the rendered
// output), so the container itself still needs Fluent's own un-hashed
// structural class (`fui-DataGridBody`/`fui-DataGridHeader`) to disambiguate;
// role alone is then sufficient (and preferred, per this package's own
// role-first anchor priority) to pick out the repeated `row` items within it,
// mirroring TabListDriver's `byRole('tab')` for a homogeneous repeated kind.
const headerRowLocator: PartLocator = byCssSelector('.fui-DataGridHeader [role="row"]');
const selectedRowCountLocator: PartLocator = byCssSelector('.fui-DataGridBody [role="row"][aria-selected="true"]');

export const defaultDataGridDriverOption: ListComponentDriverSpecificOption<DataGridRowDriver> = {
  itemClass: DataGridRowDriver,
  itemLocator: byCssSelector('.fui-DataGridBody [role="row"]'),
};

type DataGridDriverOption<ItemT extends DataGridRowDriver> = ListComponentDriverSpecificOption<ItemT> &
  Partial<IComponentDriverOption<any>>;

/**
 * Driver for the Fluent v9 `DataGrid` component (`@fluentui/react-table`,
 * re-exported from `@fluentui/react-components`) — the `columns`/`items`-
 * driven, feature-richer sibling of plain {@link TableDriver}.
 *
 * A {@link ListComponentDriver} over the data rows
 * (`.fui-DataGridBody [role="row"]`), exposing per-row
 * {@link DataGridRowDriver}s plus header reads, built-in sort, built-in row
 * selection, and column resize — mirroring `component-driver-mui-x-v9`'s
 * `DataGridPremiumDriver`/`DataGridHeaderRowDriver`/`DataGridDataRowDriver`
 * SHAPE (a driver that owns cross-cutting reads, delegating to a header-row
 * driver and per-row drivers), NOT its SCOPE — Fluent's `DataGrid` (from
 * `@fluentui/react-table`) is a materially smaller component than MUI-X's
 * paid/free DataGrid product (no virtualization, filtering, row grouping, or
 * built-in pagination), so this driver covers exactly the Fluent-native
 * feature surface and no more. See the package README's Wave 6 section for
 * the explicit scope decisions (resize IS in scope; cell editing and
 * pagination are NOT Fluent `DataGrid` features at all, not driver gaps).
 *
 * **Column identity is INDEX-based, not field-based** — unlike
 * `component-driver-mui-x-v9`'s `data-field`/`data-colindex` DOM reflection:
 * DOM audit confirms Fluent's `columnId` (the `DataGrid`'s `columns` config
 * key) has ZERO DOM reflection. `getIntrinsicElementProps`
 * (`@fluentui/react-utilities@9.26.5`) filters every slot's props through a
 * per-tag allowlist of real HTML attributes before spreading them onto the
 * DOM, and `columnId` is not in that allowlist for any element — verified by
 * reading `getNativeElementProps`'s allowlist-filtering implementation, and
 * confirmed by a rendered `ReactDOMServer.renderToStaticMarkup` snapshot
 * showing no `data-*`/`columnId` trace anywhere on a cell or header cell.
 * Every method here therefore addresses columns by their rendered ZERO-BASED
 * POSITION, the same addressing {@link TableDriver} already uses for plain
 * `Table` (where Fluent never reflected field identity to begin with).
 * @see https://react.fluentui.dev/?path=/docs/components-datagrid--docs
 */
export class DataGridDriver<ItemT extends DataGridRowDriver = DataGridRowDriver> extends ListComponentDriver<ItemT> {
  constructor(locator: PartLocator, interactor: Interactor, option: Partial<DataGridDriverOption<ItemT>> = {}) {
    super(locator, interactor, {
      ...defaultDataGridDriverOption,
      ...option,
    } as DataGridDriverOption<ItemT>);
  }

  //#region Rows, header, cells
  /** The number of data rows. */
  async getRowCount(): Promise<number> {
    return this.getItemCount();
  }

  /** The data-row driver at the given zero-based index, or `null` when out of range. */
  async getRow(index: number): Promise<ItemT | null> {
    return this.getItemByIndex(index);
  }

  /** The header row as a {@link DataGridHeaderRowDriver}, or `null` when the grid has no header (`DataGridHeader` wasn't rendered). */
  async getHeaderRow(): Promise<DataGridHeaderRowDriver | null> {
    const locator = locatorUtil.append(this.locator, headerRowLocator);
    if (!(await this.interactor.exists(locator))) {
      return null;
    }
    return new DataGridHeaderRowDriver(locator, this.interactor, this.commutableOption);
  }

  /** The number of columns, derived from the header cell count (0 when no header). */
  async getColumnCount(): Promise<number> {
    const header = await this.getHeaderRow();
    return header == null ? 0 : header.getCellCount();
  }

  /** The header cell texts, in column order (empty when no header). */
  async getHeaderTexts(): Promise<string[]> {
    const header = await this.getHeaderRow();
    return header == null ? [] : header.getCellTexts();
  }

  /** The text of the data cell at the given row/column, or `undefined` when either index is out of range. */
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
  //#endregion Rows, header, cells

  //#region Sorting
  /** The sort direction applied to the column at `columnIndex` — see {@link DataGridHeaderRowDriver.getSortDirection}. */
  async getSortDirection(columnIndex: number): Promise<Optional<TableSortDirection>> {
    const header = await this.getHeaderRow();
    return header == null ? undefined : header.getSortDirection(columnIndex);
  }

  /** Sort by the column at `columnIndex` until `direction` is reached — see {@link DataGridHeaderRowDriver.sortByColumn}. */
  async sortByColumn(columnIndex: number, direction: TableSortDirection = 'ascending'): Promise<boolean> {
    const header = await this.getHeaderRow();
    return header == null ? false : header.sortByColumn(columnIndex, direction);
  }
  //#endregion Sorting

  //#region Row selection
  /** Whether the row at `rowIndex` is selected. `false` when the row is out of range or the grid has no `selectionMode`. */
  async isRowSelected(rowIndex: number): Promise<boolean> {
    const row = await this.getRow(rowIndex);
    return row != null && (await row.isSelected());
  }

  /** Select the row at `rowIndex` (no-op if already selected). @returns `false` when the row is out of range. */
  async selectRow(rowIndex: number): Promise<boolean> {
    const row = await this.getRow(rowIndex);
    if (row == null) {
      return false;
    }
    await row.setSelected(true);
    return true;
  }

  /**
   * Deselect the row at `rowIndex` (no-op if already deselected). @returns
   * `false` when the row is out of range. In single-select mode this is
   * ALWAYS a no-op on an already-selected row — see
   * {@link DataGridRowDriver.setSelected}.
   */
  async deselectRow(rowIndex: number): Promise<boolean> {
    const row = await this.getRow(rowIndex);
    if (row == null) {
      return false;
    }
    await row.setSelected(false);
    return true;
  }

  /**
   * The number of currently-selected rows, counted directly by matching
   * `[aria-selected="true"]` rows — a single round-trip
   * ({@link Interactor.getElementCount}), rather than instantiating and
   * checking every row driver individually.
   */
  async getSelectedRowCount(): Promise<number> {
    return this.interactor.getElementCount(locatorUtil.append(this.locator, selectedRowCountLocator));
  }

  /** Select every row via the header's "select all" checkbox — see {@link DataGridHeaderRowDriver.selectAll}. */
  async selectAllRows(): Promise<boolean> {
    const header = await this.getHeaderRow();
    return header != null && (await header.selectAll());
  }

  /** Deselect every row via the header's "select all" checkbox — see {@link DataGridHeaderRowDriver.deselectAll}. */
  async deselectAllRows(): Promise<boolean> {
    const header = await this.getHeaderRow();
    return header != null && (await header.deselectAll());
  }

  /** Whether every row is currently selected — see {@link DataGridHeaderRowDriver.isAllRowsSelected}. */
  async isAllRowsSelected(): Promise<boolean> {
    const header = await this.getHeaderRow();
    return header != null && (await header.isAllRowsSelected());
  }
  //#endregion Row selection

  //#region Column resize
  /** Resize the column at `columnIndex` — see {@link DataGridHeaderRowDriver.resizeColumn}. Requires the grid's `resizableColumns`. */
  async resizeColumn(columnIndex: number, deltaPx: number): Promise<boolean> {
    const header = await this.getHeaderRow();
    return header != null && (await header.resizeColumn(columnIndex, deltaPx));
  }

  /** The rendered pixel width of the column at `columnIndex` — see {@link DataGridHeaderRowDriver.getColumnWidth}. */
  async getColumnWidth(columnIndex: number): Promise<number | undefined> {
    const header = await this.getHeaderRow();
    return header == null ? undefined : header.getColumnWidth(columnIndex);
  }

  /** Whether the column at `columnIndex` is currently keyboard-resize-focused — see {@link DataGridHeaderRowDriver.isColumnInKeyboardResizeMode}. */
  async isColumnInKeyboardResizeMode(columnIndex: number): Promise<boolean> {
    const header = await this.getHeaderRow();
    return header != null && (await header.isColumnInKeyboardResizeMode(columnIndex));
  }

  /**
   * Dispatch a key on the column at `columnIndex`'s resize handle — see
   * {@link DataGridHeaderRowDriver.pressColumnResizeKey}. Requires the caller
   * to have already entered keyboard-resize mode via their own app's entry
   * point — see `DataGridHeaderCellDriver`'s class doc.
   */
  async pressColumnResizeKey(columnIndex: number, key: string, option?: Partial<PressKeyOption>): Promise<boolean> {
    const header = await this.getHeaderRow();
    return header != null && (await header.pressColumnResizeKey(columnIndex, key, option));
  }
  //#endregion Column resize

  override get driverName(): string {
    return 'FluentV9DataGridDriver';
  }
}
