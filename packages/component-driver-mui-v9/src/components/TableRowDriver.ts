import {
  byCssSelector,
  IComponentDriverOption,
  Interactor,
  ListComponentDriver,
  ListComponentDriverSpecificOption,
  PartLocator,
} from '@atomic-testing/core';

import { TableCellDriver } from './TableCellDriver';

/**
 * Cells are located by `.MuiTableCell-root`, covering both `<td>` body cells and
 * `<th>` header cells.
 */
export const defaultTableRowDriverOption: ListComponentDriverSpecificOption<TableCellDriver> = {
  itemClass: TableCellDriver,
  itemLocator: byCssSelector('.MuiTableCell-root'),
};

type TableRowDriverOption<ItemT extends TableCellDriver> = ListComponentDriverSpecificOption<ItemT> &
  Partial<IComponentDriverOption<any>>;

/**
 * Driver for a single Material UI v9 TableRow (`.MuiTableRow-root`).
 *
 * A {@link ListComponentDriver} over the row's cells, exposing per-cell
 * {@link TableCellDriver}s (via `getItems`/`getItemByIndex`) plus convenience reads
 * of the cell texts.
 *
 * Cells are addressed positionally via `:nth-of-type`, which counts per element type.
 * This assumes a row's cells are homogeneous (all `<td>`, or all `<th>` for a header
 * row) — the common MUI rendering. A row mixing a leading `<th scope="row">` with
 * `<td>` data cells would desynchronize the index (the `<td>`s start at type-index 1
 * after the `<th>`); such rows are out of scope.
 * @see https://mui.com/material-ui/react-table/
 */
export class TableRowDriver<ItemT extends TableCellDriver = TableCellDriver> extends ListComponentDriver<ItemT> {
  constructor(locator: PartLocator, interactor: Interactor, option: Partial<TableRowDriverOption<ItemT>> = {}) {
    // A row's item shape is fixed (cells driven by TableCellDriver). The defaults are
    // applied LAST so they win over any inherited `itemLocator`/`itemClass`: when a
    // TableDriver builds its row drivers it forwards its own commutable option, whose
    // (row-level) item locator would otherwise shadow the cell locator here.
    super(locator, interactor, {
      ...option,
      ...defaultTableRowDriverOption,
    } as TableRowDriverOption<ItemT>);
  }

  /**
   * The number of cells in the row.
   */
  async getCellCount(): Promise<number> {
    return this.getItemCount();
  }

  /**
   * The cell driver at the given zero-based column index, or `null` when out of range.
   */
  async getCell(index: number): Promise<ItemT | null> {
    return this.getItemByIndex(index);
  }

  /**
   * The text of every cell, in column order.
   */
  async getCellTexts(): Promise<string[]> {
    const cells = await this.getItems();
    const texts: string[] = [];
    for (const cell of cells) {
      texts.push((await cell.getText())?.trim() ?? '');
    }
    return texts;
  }

  override get driverName(): string {
    return 'MuiV9TableRowDriver';
  }
}
