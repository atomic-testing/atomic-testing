import { ComponentDriver } from '@atomic-testing/core';

/**
 * Driver for a single Fluent v9 `DataGridCell` — a data cell in a `DataGrid`
 * row (see {@link DataGridRowDriver}).
 *
 * DOM audit (`@fluentui/react-table@9.19.17`, rendered snapshot of
 * `<DataGrid columns={...} items={...}>`): `DataGrid` forces
 * `noNativeElements: true` on its internal `useTable_unstable` call, so every
 * descendant renders as a `<div>` with an explicit ARIA role rather than a
 * native table element — `DataGridCell` renders
 * `<div role="gridcell" class="fui-DataGridCell fui-TableCell" ...>`. **Role
 * alone (`[role="gridcell"]`) is NOT a safe cell-item locator**: the
 * row's OPTIONAL leading `DataGridSelectionCell` (present only when the
 * grid's `selectionMode` is set) carries the SAME `role="gridcell"` —
 * verified in the rendered output — so {@link DataGridRowDriver} addresses
 * cells by the more specific `.fui-DataGridCell` class instead, which the
 * selection cell does not carry. A cell's content is plain text (optionally
 * wrapped in `TableCellLayout`, contributing no extra text nodes), so this
 * driver relies entirely on the inherited `getText()`/`exists()` — it exists
 * as a distinct type purely so {@link DataGridRowDriver} can expose typed
 * cell drivers.
 * @see https://react.fluentui.dev/?path=/docs/components-datagrid--docs
 */
export class DataGridCellDriver extends ComponentDriver<{}> {
  override get driverName(): string {
    return 'FluentV9DataGridCellDriver';
  }
}
