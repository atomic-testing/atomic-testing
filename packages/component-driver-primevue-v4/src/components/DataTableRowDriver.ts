import { HTMLElementDriver } from '@atomic-testing/component-driver-html';
import {
  byCssSelector,
  childListHelper,
  ComponentDriver,
  locatorUtil,
  Optional,
  PartLocator,
} from '@atomic-testing/core';

/** CSS for a body cell — the ARIA role PrimeVue stamps on every `<td>`. */
const cellSelector = '[role="cell"]';
// A ceiling, not a sleep: waitUntil returns as soon as the probe flips. PrimeVue's cell-edit
// commit/cancel is a synchronous Vue re-render (no overlay transition), so this only needs to
// absorb a render tick — verified in practice to settle well under 1000ms, the ceiling this
// package's overlay transitions already use (see DataTableDriver's filter methods).
const defaultCellEditTransitionMs = 1000;

/**
 * Driver for a single PrimeVue `DataTable` body row
 * (`<tr role="row" data-pc-section="bodyrow">`).
 *
 * Cells are `<td role="cell">` direct children, iterated with
 * `childListHelper` so selection/expander columns a future scene might add
 * (still `<td>`s, but distinguishable by selector) can never throw off the
 * position math the way a `:nth-of-type` walk would.
 *
 * **Selection (#1034).** See `DataTableDriver`'s class doc "Row selection"
 * note: {@link isSelected} reads `aria-selected` (present once the table's
 * `selectionMode` is set); {@link select}/{@link deselect} drive whichever
 * affordance the scene renders — a checkbox-column cell's real native
 * checkbox if present, else a plain click on the row.
 *
 * **Cell editing (#1034), `editMode="cell"`.** DOM audit (primevue@4.5.5):
 * a `<td>` whose column renders an `#editor` slot (CONSUMER-authored — no
 * `editable` prop needed, the slot's presence alone marks it, per
 * `data-p-editable-column`) carries `data-p-cell-editing` while its editor is
 * mounted. Unlike MUI's DataGrid (which needs a keystroke to ENTER edit), a
 * plain click is enough here — {@link startCellEdit} needs no `Enter`; Enter
 * and Escape are reserved for {@link commitCellEdit}/{@link cancelCellEdit}
 * (verified: both exit edit mode immediately — no transition delay to absorb,
 * unlike the filter overlay). The editor control is consumer-authored, so
 * {@link setCellValue} assumes a plain `<input>`, the same assumption
 * `DataTableDriver.setColumnFilter` makes for its filter value control.
 */
export class DataTableRowDriver extends ComponentDriver<{}> {
  private get selectionCheckboxLocator(): PartLocator {
    return locatorUtil.append(this.locator, byCssSelector('[data-p-selection-column="true"] input[type="checkbox"]'));
  }

  /** Whether this row is selected (`aria-selected` — requires the table's `selectionMode` to be set). */
  async isSelected(): Promise<boolean> {
    return (await this.interactor.getAttribute(this.locator, 'aria-selected')) === 'true';
  }

  /** Select this row, if not already selected. */
  async select(): Promise<void> {
    if (!(await this.isSelected())) {
      await this.toggleSelection();
    }
  }

  /** Deselect this row, if selected. */
  async deselect(): Promise<void> {
    if (await this.isSelected()) {
      await this.toggleSelection();
    }
  }

  private async toggleSelection(): Promise<void> {
    if (await this.interactor.exists(this.selectionCheckboxLocator)) {
      await this.interactor.click(this.selectionCheckboxLocator);
    } else {
      await this.interactor.click(this.locator);
    }
  }

  /** The number of cells in this row. */
  async getCellCount(): Promise<number> {
    return childListHelper.countMatchingChildren(this.interactor, this.locator, cellSelector);
  }

  /**
   * Trimmed text of the cell at the given zero-based column index, or
   * `undefined` when the index is out of range.
   */
  async getCellText(columnIndex: number): Promise<Optional<string>> {
    let position = 0;
    for await (const cell of childListHelper.iterateMatchingChildren(
      this,
      this.locator,
      cellSelector,
      HTMLElementDriver
    )) {
      if (position === columnIndex) {
        return (await cell.getText())?.trim();
      }
      position++;
    }
    return undefined;
  }

  /** Trimmed text of every cell in this row, in column order. */
  async getCellTexts(): Promise<string[]> {
    const texts: string[] = [];
    for await (const cell of childListHelper.iterateMatchingChildren(
      this,
      this.locator,
      cellSelector,
      HTMLElementDriver
    )) {
      texts.push((await cell.getText())?.trim() ?? '');
    }
    return texts;
  }

  /** Whether the cell at `columnIndex` is currently in edit mode. `undefined` if out of range. */
  async isCellEditing(columnIndex: number): Promise<Optional<boolean>> {
    const cell = await this.getCellLocatorByIndex(columnIndex);
    if (cell == null) {
      return undefined;
    }
    return (await this.interactor.getAttribute(cell, 'data-p-cell-editing')) === 'true';
  }

  /**
   * Click the cell to enter edit mode (a no-op if already editing) — see the class doc's "Cell
   * editing" note on why no keystroke is needed to enter, unlike MUI's DataGrid.
   * @returns `false` when out of range, or the column renders no `#editor` slot.
   */
  async startCellEdit(columnIndex: number): Promise<boolean> {
    const cell = await this.getCellLocatorByIndex(columnIndex);
    if (cell == null || (await this.interactor.getAttribute(cell, 'data-p-editable-column')) !== 'true') {
      return false;
    }
    if ((await this.interactor.getAttribute(cell, 'data-p-cell-editing')) === 'true') {
      return true;
    }
    await this.interactor.click(cell);
    return (await this.interactor.getAttribute(cell, 'data-p-cell-editing')) === 'true';
  }

  /**
   * Replace the value in the cell's editor input, entering edit mode first if needed — see the
   * class doc's "Cell editing" note for why the editor is assumed to be a plain `<input>`. The
   * value is not committed until {@link commitCellEdit} (or discarded by {@link cancelCellEdit}).
   * @returns `false` when out of range, not editable, or the editor renders no plain input.
   */
  async setCellValue(columnIndex: number, value: string): Promise<boolean> {
    if (!(await this.isCellEditing(columnIndex)) && !(await this.startCellEdit(columnIndex))) {
      return false;
    }
    const input = this.cellEditorInputLocator(await this.getCellLocatorByIndex(columnIndex));
    if (input == null || !(await this.interactor.exists(input))) {
      return false;
    }
    await this.interactor.enterText(input, value);
    return true;
  }

  /**
   * Commit the pending cell edit with `Enter` and wait for edit mode to end.
   * @returns `false` when out of range, or the cell isn't currently editing.
   */
  async commitCellEdit(columnIndex: number, timeoutMs: number = defaultCellEditTransitionMs): Promise<boolean> {
    return this.endCellEdit(columnIndex, 'Enter', timeoutMs);
  }

  /**
   * Discard the pending cell edit with `Escape` and wait for edit mode to end.
   * @returns `false` when out of range, or the cell isn't currently editing.
   */
  async cancelCellEdit(columnIndex: number, timeoutMs: number = defaultCellEditTransitionMs): Promise<boolean> {
    return this.endCellEdit(columnIndex, 'Escape', timeoutMs);
  }

  private async endCellEdit(columnIndex: number, key: 'Enter' | 'Escape', timeoutMs: number): Promise<boolean> {
    const cell = await this.getCellLocatorByIndex(columnIndex);
    const input = this.cellEditorInputLocator(cell);
    if (cell == null || input == null || !(await this.interactor.exists(input))) {
      return false;
    }
    await this.interactor.pressKey(input, key);
    const editing = await this.interactor.waitUntil({
      probeFn: () => this.interactor.getAttribute(cell, 'data-p-cell-editing'),
      terminateCondition: 'false',
      timeoutMs,
    });
    return editing === 'false';
  }

  private cellEditorInputLocator(cell: PartLocator | null): PartLocator | null {
    return cell == null ? null : locatorUtil.append(cell, byCssSelector('input'));
  }

  /** The `role="cell"` `<td>` at `columnIndex`, or `null` when out of range. */
  private async getCellLocatorByIndex(columnIndex: number): Promise<PartLocator | null> {
    let position = 0;
    for await (const cell of childListHelper.iterateMatchingChildren(
      this,
      this.locator,
      cellSelector,
      HTMLElementDriver
    )) {
      if (position === columnIndex) {
        return cell.locator;
      }
      position++;
    }
    return null;
  }

  get driverName(): string {
    return 'PrimeVueV4DataTableRowDriver';
  }
}
