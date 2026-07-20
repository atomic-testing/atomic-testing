import {
  byCssClass,
  IComponentDriverOption,
  Interactor,
  ListComponentDriverSpecificOption,
  PartLocator,
} from '@atomic-testing/core';

import { TableCellDriver } from './TableCellDriver';
import { TableRowDriverBase } from './TableRowDriverBase';

/**
 * Cells are located by `.fui-TableCell`, the un-hashed structural class every
 * `TableCell` carries (DOM audit, `@fluentui/react-table@9.19.17`: a body
 * row's children are homogeneous `<td class="fui-TableCell">` siblings, no
 * interleaved non-cell elements) — role is unavailable here since the cell
 * renders as a plain native `<td>` with no `role` attribute at all.
 */
export const defaultTableRowDriverOption: ListComponentDriverSpecificOption<TableCellDriver> = {
  itemClass: TableCellDriver,
  itemLocator: byCssClass('fui-TableCell'),
};

type TableRowDriverOption<ItemT extends TableCellDriver> = ListComponentDriverSpecificOption<ItemT> &
  Partial<IComponentDriverOption<any>>;

/**
 * Driver for a single Fluent v9 `TableRow` acting as a `Table` BODY (data)
 * row — see {@link TableDriver.getHeaderRow} for the header row, which is a
 * `TableHeaderRowDriver` instead since its cells are a structurally different
 * component (see {@link TableHeaderCellDriver}'s doc for why the two aren't
 * unified).
 *
 * A {@link TableRowDriverBase} over the row's `TableCell` children, mirroring
 * `component-driver-mui-v9`'s `TableRowDriver` shape.
 * @see https://react.fluentui.dev/?path=/docs/components-table--docs
 */
export class TableRowDriver<ItemT extends TableCellDriver = TableCellDriver> extends TableRowDriverBase<ItemT> {
  constructor(locator: PartLocator, interactor: Interactor, option: Partial<TableRowDriverOption<ItemT>> = {}) {
    // A row's cell shape is fixed (TableCell driven by TableCellDriver). Applied LAST
    // so it wins over any inherited itemLocator/itemClass a parent TableDriver
    // forwards via commutableOption — same reasoning as MUI-v9's TableRowDriver.
    super(locator, interactor, {
      ...option,
      ...defaultTableRowDriverOption,
    } as TableRowDriverOption<ItemT>);
  }

  override get driverName(): string {
    return 'FluentV9TableRowDriver';
  }
}
