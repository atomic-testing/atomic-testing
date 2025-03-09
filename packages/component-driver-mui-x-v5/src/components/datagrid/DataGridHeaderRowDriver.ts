import { byRole, IComponentDriverOption, Interactor, locatorUtil, PartLocator } from '@atomic-testing/core';

import { DataGridRowDriver } from './DataGridRowDriver';

export class DataGridHeaderRowDriver extends DataGridRowDriver {
  private readonly _headerCellLocator: PartLocator;
  constructor(locator: PartLocator, interactor: Interactor, option?: Partial<IComponentDriverOption>) {
    super(locator, interactor, {
      ...option,
      parts: {},
    });

    this._headerCellLocator = locatorUtil.append(locator, byRole('columnheader'));
  }

  getColumnCount(): Promise<number> {
    return this.getCellCount();
  }

  protected override getCellLocator(): PartLocator {
    return this._headerCellLocator;
  }

  override get driverName(): string {
    return 'MuiV5DataGridHeaderRowDriver';
  }
}
