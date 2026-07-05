import { HTMLElementDriver } from '@atomic-testing/component-driver-html';
import { byRole, ComponentDriver, listHelper, locatorUtil, PartLocator } from '@atomic-testing/core';

/**
 * Driver for one data row of an Angular Material table (`MatTable`).
 *
 * Cells are located by `role="cell"` — the CDK table sets that role explicitly
 * on the cells of **both** rendering variants (even on native `<td>` elements;
 * see angular/components#29784), so the same locator serves the native
 * `<table mat-table>` and the flex `<mat-table>` DOM. Obtained through
 * `TableDriver.getRowByIndex` / `getItems`.
 */
export class TableRowDriver extends ComponentDriver {
  private get cellsLocator(): PartLocator {
    return locatorUtil.append(this.locator, byRole('cell'));
  }

  /**
   * The number of cells in this row.
   */
  async getCellCount(): Promise<number> {
    return listHelper.getListItemCount(this, this.cellsLocator);
  }

  /**
   * The trimmed text of the cell at the given zero-based column index, or
   * `null` when the index is out of range. For a name-based lookup use
   * `TableDriver.getCellText`, which resolves the column through the header.
   */
  async getCellText(columnIndex: number): Promise<string | null> {
    const cell = await listHelper.getListItemByIndex(this, this.cellsLocator, columnIndex, HTMLElementDriver);
    if (cell == null) {
      return null;
    }
    return (await cell.getText())?.trim() ?? '';
  }

  /**
   * The trimmed text of every cell in this row, in column order.
   */
  async getCellTexts(): Promise<string[]> {
    const texts: string[] = [];
    for await (const cell of listHelper.getListItemIterator(this, this.cellsLocator, HTMLElementDriver)) {
      texts.push((await cell.getText())?.trim() ?? '');
    }
    return texts;
  }

  override get driverName(): string {
    return 'AngularMaterialV20TableRowDriver';
  }
}
