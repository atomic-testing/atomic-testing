import {
  byCssClass,
  IComponentDriverOption,
  Interactor,
  ListComponentDriverSpecificOption,
  Optional,
  PartLocator,
} from '@atomic-testing/core';

import { TableHeaderCellDriver, TableSortDirection } from './TableHeaderCellDriver';
import { TableRowDriverBase } from './TableRowDriverBase';

/**
 * Header cells are located by `.fui-TableHeaderCell` — the un-hashed
 * structural class every `TableHeaderCell` carries (DOM audit,
 * `@fluentui/react-table@9.19.17`: the header row's children are homogeneous
 * `<th class="fui-TableHeaderCell">` siblings) — role is unavailable here
 * since the cell renders as a plain native `<th>` with no `role` attribute.
 */
export const defaultTableHeaderRowDriverOption: ListComponentDriverSpecificOption<TableHeaderCellDriver> = {
  itemClass: TableHeaderCellDriver,
  itemLocator: byCssClass('fui-TableHeaderCell'),
};

type TableHeaderRowDriverOption<ItemT extends TableHeaderCellDriver> = ListComponentDriverSpecificOption<ItemT> &
  Partial<IComponentDriverOption<any>>;

/**
 * Driver for the Fluent v9 `TableRow` acting as a `Table`'s HEADER row (the
 * one returned by {@link TableDriver.getHeaderRow}) — a
 * {@link TableRowDriverBase} over `TableHeaderCell` children, adding the
 * sort read/drive surface that only header cells carry.
 *
 * **Sorting on a plain `Table` is best-effort/generic, by design**: unlike
 * `DataGrid` (see {@link DataGridHeaderRowDriver}), `@fluentui/react-table`'s
 * presentational `Table`/`TableHeader`/`TableHeaderCell` ship NO built-in
 * sort orchestration — a consumer wires `sortable`/`sortDirection`/`onClick`
 * on `TableHeaderCell` manually (optionally via the `useTableSort` hook, but
 * nothing stops a bespoke implementation). This driver therefore only reads
 * whatever `aria-sort` is present and clicks whatever the header cell's own
 * root carries an `onClick` for — mirroring `component-driver-mui-v9`'s
 * `TableDriver.getSortDirection`/`sortByColumn`, which does the same against
 * `.MuiTableSortLabel-root` — rather than assuming a specific click-count/
 * direction-cycle contract, since that's entirely up to the consumer's own
 * wiring and cannot be verified generically.
 */
export class TableHeaderRowDriver<
  ItemT extends TableHeaderCellDriver = TableHeaderCellDriver,
> extends TableRowDriverBase<ItemT> {
  constructor(locator: PartLocator, interactor: Interactor, option: Partial<TableHeaderRowDriverOption<ItemT>> = {}) {
    // Applied LAST so it wins over any inherited itemLocator/itemClass a parent
    // TableDriver forwards via commutableOption — same reasoning as TableRowDriver.
    super(locator, interactor, {
      ...option,
      ...defaultTableHeaderRowDriverOption,
    } as TableHeaderRowDriverOption<ItemT>);
  }

  /**
   * The sort direction currently applied to the column at `columnIndex`, or
   * `undefined` when that column is out of range, not sortable, or sortable
   * but unsorted — see {@link TableHeaderCellDriver.getSortDirection}.
   */
  async getSortDirection(columnIndex: number): Promise<Optional<TableSortDirection>> {
    const cell = await this.getCell(columnIndex);
    return cell == null ? undefined : cell.getSortDirection();
  }

  /**
   * Click the header cell at `columnIndex` once, toggling/applying whatever
   * sort behavior the consumer wired up.
   * @returns `false` when the column is out of range or has no sort
   * affordance at all (no `aria-sort`) — mirrors MUI-v9's `TableDriver.sortByColumn`.
   */
  async sortByColumn(columnIndex: number): Promise<boolean> {
    const cell = await this.getCell(columnIndex);
    if (cell == null || !(await cell.isSortable())) {
      return false;
    }
    await cell.click();
    return true;
  }

  override get driverName(): string {
    return 'FluentV9TableHeaderRowDriver';
  }
}
