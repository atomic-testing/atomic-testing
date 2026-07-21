import { byCssClass, locatorUtil, type PartLocator, type PressKeyOption } from '@atomic-testing/core';

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
 * **Keyboard-accessible resize** (`useKeyboardResizing`, `@fluentui/react-table`
 * source audit): the SAME resize handle also carries a keyboard path — `role="separator"`,
 * `aria-label="Resize column"`, `aria-valuetext="<n> pixels"`, and tabster hints
 * that exempt `ArrowLeft`/`ArrowRight` from the grid's own arrow-navigation so
 * they reach the handle instead. Once the handle is FOCUSED, its `onKeyDown`
 * drives the same `setColumnWidth` the mouse drag does — `ArrowLeft`/`ArrowRight`
 * adjust by a fixed step (`Shift` halves the step), `Enter`/`Space`/`Escape` blur
 * it back out. **Entering that focused state has NO default trigger Fluent ships
 * at all** — verified against the full `@fluentui/react-table` source: the
 * capability is exposed only as an imperative escape hatch
 * (`DataGridContext.columnSizing_unstable.enableKeyboardMode(columnId)`), which
 * NOTHING in the library calls — not the header cell's `onKeyDown`, not the
 * handle's own `onClick`/`onFocus`. Fluent's own Storybook demonstrates it via a
 * consumer-added right-click context menu; this is why {@link resize}'s
 * `deltaPx` cannot itself be driven by "just press Enter" — there is no `Enter`
 * for a driver to press until the CONSUMING APP has wired its own entry point
 * (a button, a menu item, whatever fits their UI) to that same
 * `enableKeyboardMode` call. {@link pressResizeKey} and
 * {@link isInKeyboardResizeMode} therefore model exactly what Fluent itself
 * contributes to this interaction (the focused-handle key contract), and
 * deliberately do NOT assume any particular app-side entry affordance — the
 * caller drives that part themselves (e.g. `engine.parts.myResizeButton.click()`)
 * before calling {@link pressResizeKey}. Verified via a rendered probe: once
 * focus is moved onto the handle by simulating a real app's entry point, a
 * plain `ArrowRight` key event synchronously invokes `DataGrid`'s
 * `onColumnResize` callback with the expected `+20`px delta — confirming the
 * key contract fires correctly. The resulting **inline `style="width"` does
 * NOT visibly change under jsdom**, for the identical reason {@link resize}'s
 * own drag doesn't: `resizableColumns`' default `autoFitColumns` recomputes
 * column widths from the measured container width on every state change, and
 * jsdom has no layout engine (that width is permanently `0`) — so this, too,
 * is an E2E-only width assertion; only the DOM CONTRACT (focus/blur, key
 * dispatch not throwing) is verifiable under jsdom.
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

  /**
   * Whether this column's resize handle is currently the FOCUSED, keyboard-
   * interactive one — read via `aria-hidden` (`"false"` only for the active
   * column; see class doc's keyboard-resize section). `false` also when the
   * column has no resize handle at all.
   */
  async isInKeyboardResizeMode(): Promise<boolean> {
    if (!(await this.interactor.exists(this.resizeHandleLocator))) {
      return false;
    }
    return (await this.interactor.getAttribute(this.resizeHandleLocator, 'aria-hidden')) === 'false';
  }

  /**
   * Dispatch a key on this column's resize handle — `'ArrowLeft'`/`'ArrowRight'`
   * adjust the width (Fluent's fixed step, halved with `option.shift`),
   * `'Enter'`/`'Space'`/`'Escape'` exit keyboard-resize mode. See the class
   * doc's keyboard-resize section for why this assumes the handle is ALREADY
   * focused/interactive — reaching that state has no Fluent-shipped trigger,
   * so the caller must have driven their own app's entry point (whatever it
   * is) into `columnSizing_unstable.enableKeyboardMode` first.
   *
   * Gated on {@link isInKeyboardResizeMode} rather than just the handle's
   * existence: `useKeyboardResizing`'s `onKeyDown` handler is ONE shared
   * closure reused across every column's handle (verified in source), reading
   * a single grid-wide "which column is active" state rather than which DOM
   * node the event actually landed on. Dispatching on a handle that exists
   * but isn't the active one wouldn't just no-op — it would silently resize
   * WHICHEVER OTHER column the grid currently has active, a wrong-column
   * mutation the caller has no way to see coming. Gating here makes that
   * impossible: this method only ever affects the column it claims to.
   * @returns `false` when this column has no resize handle at all (same
   * last-column caveat as {@link resize}), or when this column isn't
   * currently the one in keyboard-resize mode.
   */
  async pressResizeKey(key: string, option?: Partial<PressKeyOption>): Promise<boolean> {
    if (!(await this.isInKeyboardResizeMode())) {
      return false;
    }
    await this.interactor.pressKey(this.resizeHandleLocator, key, option);
    return true;
  }

  override get driverName(): string {
    return 'FluentV9DataGridHeaderCellDriver';
  }
}
