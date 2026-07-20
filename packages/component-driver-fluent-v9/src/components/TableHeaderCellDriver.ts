import { ComponentDriver, Optional } from '@atomic-testing/core';

/** Reported sort state of a column, mirroring the `aria-sort` values Fluent emits. */
export type TableSortDirection = 'ascending' | 'descending';

/**
 * Driver for a single Fluent v9 `TableHeaderCell` — a column header in a
 * plain `Table`'s header row (see {@link TableHeaderRowDriver}), and the base
 * for {@link DataGridHeaderCellDriver}, which adds column-resize on top of
 * the identical sort surface modeled here.
 *
 * **Why this is a distinct class from {@link TableCellDriver}, unlike
 * `component-driver-mui-v9`'s single `TableCellDriver`** (which covers both
 * `<td>` and `<th>` via a `component` prop on ONE MUI component): DOM audit
 * (`@fluentui/react-table@9.19.17`) shows Fluent ships `TableCell` and
 * `TableHeaderCell` as two SEPARATE components with two separate structural
 * classes (`fui-TableCell` render `<td>`, `fui-TableHeaderCell` renders
 * `<th>`) and materially different behavior — only the header cell carries
 * `aria-sort` and an internal sort button/icon. A single shared driver class
 * cannot honestly model both, so this package splits them the way Fluent
 * itself does.
 *
 * DOM audit (verified via a rendered `ReactDOMServer.renderToStaticMarkup`
 * snapshot of `<Table sortable>` with one sortable and one non-sortable
 * `TableHeaderCell`): a SORTABLE header cell renders
 * `<th aria-sort="ascending|descending|none" class="fui-TableHeaderCell">`
 * wrapping `<div role="button" tabindex="0" class="fui-TableHeaderCell__button">`
 * (the focusable/interactive sub-element) and, once a direction is set, a
 * `<span class="fui-TableHeaderCell__sortIcon">` arrow icon. A NON-sortable
 * header cell carries **no `aria-sort` attribute at all** (absent, not
 * `"none"`) — {@link isSortable} uses that presence/absence as the signal.
 * The click handler Fluent (or a consumer manually wiring `onClick`) attaches
 * lands on the CELL ROOT itself (`getIntrinsicElementProps` spreads `...props`,
 * including `onClick`, onto the `<th>`/`<div role="columnheader">`), not only
 * the inner button — so the inherited {@link ComponentDriver.click} (which
 * targets this driver's own root locator) is sufficient to trigger a sort
 * click without reaching into `.fui-TableHeaderCell__button` specifically.
 */
export class TableHeaderCellDriver extends ComponentDriver<{}> {
  /**
   * Whether this column has a sort affordance at all, i.e. its header cell
   * carries an `aria-sort` attribute (present only when `sortable` is set,
   * either directly on `TableHeaderCell` or inherited from the parent
   * `Table`'s own `sortable` prop). `false` does not mean "unsorted" — see
   * {@link getSortDirection} for that distinction.
   */
  async isSortable(): Promise<boolean> {
    return (await this.interactor.getAttribute(this.locator, 'aria-sort')) != null;
  }

  /**
   * This column's current sort direction, read from `aria-sort`.
   * @returns `undefined` when the column is not sortable at all, OR when it
   * is sortable but currently unsorted (`aria-sort="none"`) — both render as
   * "no direction to report", matching `component-driver-mui-v9`'s
   * `TableDriver.getSortDirection`.
   */
  async getSortDirection(): Promise<Optional<TableSortDirection>> {
    const value = await this.interactor.getAttribute(this.locator, 'aria-sort');
    return value === 'ascending' || value === 'descending' ? value : undefined;
  }

  override get driverName(): string {
    return 'FluentV9TableHeaderCellDriver';
  }
}
