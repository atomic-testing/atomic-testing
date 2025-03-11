import { HTMLElementDriver } from '@atomic-testing/component-driver-html';
import { byAttribute, ComponentDriver, listHelper, locatorUtil, PartLocator } from '@atomic-testing/core';

export abstract class DataGridRowDriver extends ComponentDriver {
  protected async getCellCount(): Promise<number> {
    let count = 0;
    for await (const _ of listHelper.getListItemIterator(this, this.getCellLocator(), HTMLElementDriver)) {
      count++;
    }
    return count;
  }

  /**
   * Get the text of each visible cell in the row.
   * Caveat: Because of virtualization, the text of the cell may not be available until the cell is visible.
   * @returns A promise array of text of each visible cell in the row
   */
  async getRowText(): Promise<string[]> {
    const textList: string[] = [];
    for await (const cell of listHelper.getListItemIterator(this, this.getCellLocator(), HTMLElementDriver)) {
      const text = await cell.getText();
      textList.push(text!.trim());
    }
    return textList;
  }

  /**
   * Get the cell driver at the specified index or data field.
   * Caveat: Because of virtualization, the cell may not be available until the cell is visible.
   * @param cellIndexOrField number: column index, string: column field
   * @param driverClass The driver class of the cell. Default is HTMLElementDriver
   * @returns A promise of the cell driver, or null if the cell is not found
   */
  async getCell<DriverT extends ComponentDriver>(
    cellIndexOrField: number | string, // number: column index, string: column field
    // @ts-ignore
    driverClass: typeof ComponentDriver = HTMLElementDriver
  ): Promise<DriverT | null> {
    let cellLocator: PartLocator;
    if (typeof cellIndexOrField === 'number') {
      cellLocator = byAttribute('data-colindex', cellIndexOrField.toString());
    } else {
      cellLocator = byAttribute('data-field', cellIndexOrField);
    }
    const locator = locatorUtil.append(this.locator, cellLocator);
    const cellExists = await this.interactor.exists(locator);
    if (cellExists) {
      // @ts-ignore
      return new driverClass(locator, this.interactor, this.commutableOption);
    }

    return null;
  }

  protected abstract getCellLocator(): PartLocator;
}
