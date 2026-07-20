import { byCssClass, locatorUtil, type PartLocator } from '@atomic-testing/core';

import { TableHeaderCellDriver } from './TableHeaderCellDriver';

const resizeHandleLocator: PartLocator = byCssClass('fui-TableResizeHandle');
const widthStylePattern = /(?:^|;)\s*width:\s*([\d.]+)px/;

/**
 * Driver for a single Fluent v9 `DataGridHeaderCell` — a column header in a
 * `DataGrid`'s header row (see {@link DataGridHeaderRowDriver}).
 *
 * **Extends {@link TableHeaderCellDriver} rather than duplicating it**: DOM
 * audit (`@fluentui/react-table@9.19.17`) shows `useDataGridHeaderCell_unstable`
 * delegates straight to `useTableHeaderCell_unstable` (its `renderDataGridHeaderCell_unstable`
 * literally calls `renderTableHeaderCell_unstable`) — the ONLY behavioral
 * difference from a plain `TableHeaderCell` is that `DataGrid` wires the sort
 * click automatically (`toggleColumnSort`) and optionally adds a resize
 * handle, neither of which changes the `aria-sort` read/click contract this
 * class inherits unchanged. Rendered snapshot: `<div role="columnheader"
 * aria-sort="none" class="fui-DataGridHeaderCell fui-TableHeaderCell" ...>`
 * — both the DataGrid-specific and base classes are present (Griffel
 * `mergeClasses` stacks them), so either would work as a locator anchor; this
 * package's `.fui-DataGridCell`-vs-`role="gridcell"` reasoning below is the
 * one place role and class diverge in this family.
 *
 * **Column resize** (`DataGrid`'s `resizableColumns` prop — see
 * {@link DataGridHeaderRowDriver.resizeColumn} and the package README's Wave 6
 * scope note on why this IS in scope despite being implemented internally via
 * `useTableColumnSizing_unstable`): rendered snapshot of a resizable, non-last
 * column's header cell shows a `<span class="fui-DataGridHeaderCell__aside">`
 * wrapping `<div role="separator" aria-label="Resize column"
 * aria-valuetext="150 pixels" aria-hidden="true" class="fui-TableResizeHandle"
 * data-tabster="...">` with `onMouseDown`/`onTouchStart` handlers — the same
 * mouse-drag-driven shape `component-driver-mui-x-v9`'s
 * `DataGridPremiumDriver.resizeColumn` targets, so {@link resize} uses the
 * same portable `Interactor.drag` primitive. **The LAST column renders no
 * resize handle at all** when `DataGrid`'s own `autoFitColumns` default
 * (`true`) is in effect — verified in the rendered output (the aside slot is
 * `null` for the final column so it can absorb the remaining container
 * width) — {@link resize} returns `false` in that case rather than throwing.
 *
 * Unlike `component-driver-mui-x-v9`'s `DataGridPremiumDriver.getColumnWidth`
 * (which reads the header's bounding box — zero under jsdom, since jsdom has
 * no layout engine, so that read is E2E-only there), Fluent's resized-column
 * width is reflected as a literal inline `style="width:Npx;min-width:Npx;
 * max-width:Npx"` on the cell (verified in the rendered output; set only when
 * `resizableColumns` is on) — {@link getWidthPx} parses that inline style
 * instead, which is portable under jsdom too.
 */
export class DataGridHeaderCellDriver extends TableHeaderCellDriver {
  private get resizeHandleLocator(): PartLocator {
    return locatorUtil.append(this.locator, resizeHandleLocator);
  }

  /**
   * This column's current rendered pixel width, parsed from the inline
   * `style="width:Npx"` `resizableColumns` stamps on the header cell, or
   * `undefined` when `resizableColumns` is off (no inline width is set at
   * all in that case).
   */
  async getWidthPx(): Promise<number | undefined> {
    const style = await this.interactor.getAttribute(this.locator, 'style');
    const match = style == null ? null : widthStylePattern.exec(style);
    return match == null ? undefined : Number(match[1]);
  }

  /**
   * Resize this column by dragging its resize handle by `deltaPx` (positive
   * widens, negative narrows) — see the class doc for the drag technique and
   * the last-column caveat.
   * @returns `false` when this column has no resize handle (requires
   * `resizableColumns`; the last column has none by default — see class doc).
   * jsdom has no layout engine, so the drag has no positional outcome there;
   * the resulting width change is E2E-only (mirrors every other drag-based
   * primitive in this package).
   */
  async resize(deltaPx: number): Promise<boolean> {
    if (!(await this.interactor.exists(this.resizeHandleLocator))) {
      return false;
    }
    await this.interactor.drag(this.resizeHandleLocator, { x: deltaPx, y: 0 });
    return true;
  }

  override get driverName(): string {
    return 'FluentV9DataGridHeaderCellDriver';
  }
}
