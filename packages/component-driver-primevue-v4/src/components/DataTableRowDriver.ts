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

  get driverName(): string {
    return 'PrimeVueV4DataTableRowDriver';
  }
}
