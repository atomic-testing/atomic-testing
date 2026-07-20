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

import type { TableSortDirection } from './TableHeaderCellDriver';
import { TableHeaderRowDriver } from './TableHeaderRowDriver';
import { TableRowDriver } from './TableRowDriver';

// Body rows are the iterated items; the header row is addressed separately, exactly
// mirroring component-driver-mui-v9's TableDriver split.
const headerRowLocator: PartLocator = byCssSelector('.fui-TableHeader .fui-TableRow');

/**
 * Body rows are located under `.fui-TableBody`, so header rows are never
 * mistaken for data rows (DOM audit, `@fluentui/react-table@9.19.17`: by
 * default `Table` renders real native `<table>`/`<thead>`/`<tbody>`/`<tr>`
 * elements with no `role` attributes at all — verified via a rendered
 * `ReactDOMServer.renderToStaticMarkup` snapshot — so, unlike `DataGrid`
 * below, there is no ARIA role to anchor on and Fluent's own un-hashed
 * structural classes are the only stable handle).
 */
export const defaultTableDriverOption: ListComponentDriverSpecificOption<TableRowDriver> = {
  itemClass: TableRowDriver,
  itemLocator: byCssSelector('.fui-TableBody .fui-TableRow'),
};

type TableDriverOption<ItemT extends TableRowDriver> = ListComponentDriverSpecificOption<ItemT> &
  Partial<IComponentDriverOption<any>>;

/**
 * Driver for the Fluent v9 `Table` component (`@fluentui/react-table`,
 * re-exported from `@fluentui/react-components`).
 *
 * A {@link ListComponentDriver} over the data (body) rows
 * (`.fui-TableBody .fui-TableRow`), exposing per-row {@link TableRowDriver}s
 * plus header reads and best-effort column sort state — templated off
 * `component-driver-mui-v9`'s `TableDriver`, per issue #1106's explicit ask
 * that plain `Table` mirror that package's row/cell/header split. See
 * {@link TableRowDriverBase} for why header cells get their OWN row driver
 * class ({@link TableHeaderRowDriver}) rather than being folded into this one
 * the way MUI's single `TableRowDriver` handles both `<td>` and `<th>` — a
 * genuine DOM difference (`TableCell`/`TableHeaderCell` are two separate
 * Fluent components with two separate structural classes and behaviors), not
 * a stylistic choice.
 *
 * For `DataGrid` — the richer, `columns`/`items`-driven sibling with built-in
 * sort/selection/resize — see {@link DataGridDriver}.
 * @see https://react.fluentui.dev/?path=/docs/components-table--docs
 */
export class TableDriver<ItemT extends TableRowDriver = TableRowDriver> extends ListComponentDriver<ItemT> {
  constructor(locator: PartLocator, interactor: Interactor, option: Partial<TableDriverOption<ItemT>> = {}) {
    super(locator, interactor, {
      ...defaultTableDriverOption,
      ...option,
    } as TableDriverOption<ItemT>);
  }

  /** The number of data (body) rows. */
  async getRowCount(): Promise<number> {
    return this.getItemCount();
  }

  /** The data-row driver at the given zero-based index, or `null` when out of range. */
  async getRow(index: number): Promise<ItemT | null> {
    return this.getItemByIndex(index);
  }

  /** The header row as a {@link TableHeaderRowDriver}, or `null` when the table has no header. */
  async getHeaderRow(): Promise<TableHeaderRowDriver | null> {
    const locator = locatorUtil.append(this.locator, headerRowLocator);
    if (!(await this.interactor.exists(locator))) {
      return null;
    }
    return new TableHeaderRowDriver(locator, this.interactor, this.commutableOption);
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

  /**
   * The text of the data cell at the given row/column, or `undefined` when
   * either index is out of range.
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
   * The sort direction applied to the column at `columnIndex`, or `undefined`
   * when the table has no header, the column is out of range, or that column
   * has no sort applied — see {@link TableHeaderRowDriver.getSortDirection}
   * for the generic/best-effort contract this delegates to.
   */
  async getSortDirection(columnIndex: number): Promise<Optional<TableSortDirection>> {
    const header = await this.getHeaderRow();
    return header == null ? undefined : header.getSortDirection(columnIndex);
  }

  /**
   * Click the header cell at `columnIndex` once — see
   * {@link TableHeaderRowDriver.sortByColumn} for the generic/best-effort
   * contract this delegates to.
   * @returns `false` when the table has no header, the column is out of
   * range, or that column has no sort control.
   */
  async sortByColumn(columnIndex: number): Promise<boolean> {
    const header = await this.getHeaderRow();
    return header == null ? false : header.sortByColumn(columnIndex);
  }

  override get driverName(): string {
    return 'FluentV9TableDriver';
  }
}
