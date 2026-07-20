import { byCssSelector, ComponentDriverCtor, locatorUtil, Optional, type PartLocator } from '@atomic-testing/core';

import { DataGridHeaderCellDriver } from './DataGridHeaderCellDriver';
import { DataGridRowDriverBase } from './DataGridRowDriverBase';
import type { TableSortDirection } from './TableHeaderCellDriver';

// DOM audit (@fluentui/react-table@9.19.17): a header cell renders
// `<div role="columnheader">`, distinct from the header row's own optional
// `DataGridSelectionCell` ("select all"), which renders `role="gridcell"` —
// verified in the rendered output — so role alone unambiguously selects real
// header cells here, unlike DataGridRowDriver's data cells (see that class's
// doc for why role is NOT enough for `DataGridCell`).
const headerCellSelector = '[role="columnheader"]';
const selectAllInputSelector: PartLocator = byCssSelector('.fui-DataGridSelectionCell input');
const indeterminatePseudoClass: PartLocator = byCssSelector(':indeterminate', 'Same');

/**
 * Driver for the Fluent v9 `DataGridRow` acting as a `DataGrid`'s HEADER row
 * (the one returned by {@link DataGridDriver.getHeaderRow}) — a
 * {@link DataGridRowDriverBase} over `DataGridHeaderCell` children, adding
 * the sort, "select all", and column-resize surfaces only the header carries.
 *
 * **Sorting** — DOM audit (`@fluentui/react-table@9.19.17`): `DataGrid`
 * wires each sortable `DataGridHeaderCell`'s click to `useTableSort`'s
 * `toggleColumnSort` automatically (see `DataGridHeaderCellDriver`, which
 * inherits the `aria-sort` read/click from `TableHeaderCellDriver`
 * unchanged). Verified against `useTableSort`'s `toggleColumnSort` source:
 * the cycle is only TWO states (`'ascending' ↔ 'descending'`) once a column
 * has been clicked once — there is no third "click back to unsorted" state
 * the way `component-driver-mui-v9`'s `TableDriver`/MUI's own `DataGrid`
 * offer, so {@link sortByColumn} loops at most twice (not three times like
 * MUI-v9's `sortByColumn`) to reach a requested direction.
 *
 * **Selection ("select all")** — DOM audit, rendered snapshot of `<DataGrid
 * selectionMode="multiselect">`: the header row's own
 * `DataGridSelectionCell` renders a real `<input type="checkbox">` whose
 * `checked` reflects `allRowsSelected`/`someRowsSelected` (tri-state:
 * `true`/`'mixed'`/`false` — `useDataGridSelectionCell_unstable`), read here
 * the same way `CheckboxDriver.isIndeterminate()` reads any Fluent
 * checkbox's live `.indeterminate` property, via the `:indeterminate` CSS
 * pseudo-class. In `selectionMode="single"`, the header's selection cell
 * renders with **no input at all** (`radioIndicator: isHeader ? null :
 * undefined` — verified in the rendered output: the cell is present as an
 * empty spacer `<div>`), matching the fact that "select all" has no meaning
 * for single-select — {@link isAllRowsSelected}/{@link selectAll}/
 * {@link deselectAll} return `false` in that case rather than throwing.
 *
 * **Column resize** delegates per-column to {@link DataGridHeaderCellDriver} —
 * see that class's doc for the resize technique and the last-column caveat.
 */
export class DataGridHeaderRowDriver extends DataGridRowDriverBase<DataGridHeaderCellDriver> {
  protected override getCellSelector(): string {
    return headerCellSelector;
  }

  protected override getCellClass(): ComponentDriverCtor<DataGridHeaderCellDriver> {
    return DataGridHeaderCellDriver;
  }

  private get selectAllInputLocator(): PartLocator {
    return locatorUtil.append(this.locator, selectAllInputSelector);
  }

  //#region Sorting
  /** The sort direction currently applied to the column at `columnIndex` — see {@link DataGridHeaderCellDriver.getSortDirection}. */
  async getSortDirection(columnIndex: number): Promise<Optional<TableSortDirection>> {
    const cell = await this.getCell(columnIndex);
    return cell == null ? undefined : cell.getSortDirection();
  }

  /**
   * Click the header cell at `columnIndex` until `direction` is reached (at
   * most twice — see class doc for why this is a two-state cycle, not three).
   * @returns `false` when the column is out of range or is not sortable.
   */
  async sortByColumn(columnIndex: number, direction: TableSortDirection = 'ascending'): Promise<boolean> {
    const cell = await this.getCell(columnIndex);
    if (cell == null || !(await cell.isSortable())) {
      return false;
    }
    for (let attempt = 0; attempt < 2; attempt++) {
      if ((await cell.getSortDirection()) === direction) {
        return true;
      }
      await cell.click();
    }
    return (await cell.getSortDirection()) === direction;
  }
  //#endregion Sorting

  //#region Selection
  /** Whether every row is selected, via the "select all" checkbox's checked state. `false` in single-select mode (no such control exists). */
  async isAllRowsSelected(): Promise<boolean> {
    if (!(await this.interactor.exists(this.selectAllInputLocator))) {
      return false;
    }
    return this.interactor.isChecked(this.selectAllInputLocator);
  }

  /** Whether some but not all rows are selected (the "select all" checkbox's indeterminate state). `false` in single-select mode. */
  async isSomeRowsSelected(): Promise<boolean> {
    if (!(await this.interactor.exists(this.selectAllInputLocator))) {
      return false;
    }
    return this.interactor.exists(locatorUtil.append(this.selectAllInputLocator, indeterminatePseudoClass));
  }

  /** Select every row via the "select all" checkbox (no-op when already all selected). @returns `false` in single-select mode (no such control). */
  async selectAll(): Promise<boolean> {
    if (!(await this.interactor.exists(this.selectAllInputLocator))) {
      return false;
    }
    if (!(await this.isAllRowsSelected())) {
      await this.interactor.click(this.selectAllInputLocator);
    }
    return true;
  }

  /**
   * Deselect every row via the "select all" checkbox. From the indeterminate
   * state (some rows selected) the first click selects all, so up to two
   * clicks may be needed — same contract as
   * `component-driver-mui-x-v9`'s `DataGridPremiumDriver.deselectAllRows`.
   * @returns `false` in single-select mode (no such control).
   */
  async deselectAll(): Promise<boolean> {
    if (!(await this.interactor.exists(this.selectAllInputLocator))) {
      return false;
    }
    for (let click = 0; click < 2 && ((await this.isAllRowsSelected()) || (await this.isSomeRowsSelected())); click++) {
      await this.interactor.click(this.selectAllInputLocator);
    }
    return true;
  }
  //#endregion Selection

  //#region Column resize
  /** Resize the column at `columnIndex` — see {@link DataGridHeaderCellDriver.resize}. */
  async resizeColumn(columnIndex: number, deltaPx: number): Promise<boolean> {
    const cell = await this.getCell(columnIndex);
    return cell == null ? false : cell.resize(deltaPx);
  }

  /** The rendered pixel width of the column at `columnIndex` — see {@link DataGridHeaderCellDriver.getWidthPx}. */
  async getColumnWidth(columnIndex: number): Promise<number | undefined> {
    const cell = await this.getCell(columnIndex);
    return cell == null ? undefined : cell.getWidthPx();
  }
  //#endregion Column resize

  override get driverName(): string {
    return 'FluentV9DataGridHeaderRowDriver';
  }
}
