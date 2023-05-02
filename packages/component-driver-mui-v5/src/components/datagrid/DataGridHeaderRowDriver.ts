import { HTMLElementDriver } from '@atomic-testing/component-driver-html';
import {
  byRole,
  ComponentDriver,
  IComponentDriverOption,
  Interactor,
  listHelper,
  locatorUtil,
  PartLocator,
  ScenePart,
} from '@atomic-testing/core';

const parts = {} satisfies ScenePart;

/**
 * Driver for Material UI v5 DataGridPro component.
 * V5 DataGridPro component does not support data-testid, to use data-testid
 * to locate the component, you need to put the data-testid on the parent element of the grid
 * @see https://v5.mui.com/x/react-data-grid/
 */
export class DataGridHeaderRowDriver extends ComponentDriver<typeof parts> {
  private readonly _headerCellLocator: PartLocator;
  constructor(locator: PartLocator, interactor: Interactor, option?: Partial<IComponentDriverOption>) {
    super(locator, interactor, {
      ...option,
      parts,
    });

    this._headerCellLocator = locatorUtil.append(locator, byRole('columnheader'));
  }

  async getColumnCount(): Promise<number> {
    let count = 0;
    for await (const _ of listHelper.getListItemIterator(this, this._headerCellLocator, HTMLElementDriver)) {
      count++;
    }
    return count;
  }

  override get driverName(): string {
    return 'MuiV5DataGridHeaderRowDriver';
  }
}
