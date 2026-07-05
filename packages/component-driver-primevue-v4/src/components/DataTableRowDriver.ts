import { HTMLElementDriver } from '@atomic-testing/component-driver-html';
import { childListHelper, ComponentDriver, Optional } from '@atomic-testing/core';

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
 */
export class DataTableRowDriver extends ComponentDriver<{}> {
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
