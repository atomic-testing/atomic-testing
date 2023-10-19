import { byRole, IComponentDriverOption, Interactor, locatorUtil, PartLocator } from '@atomic-testing/core';

import { DataGridRowDriverBase } from './DataGridRowDriverBase';

export class DataGridDataRowDriver extends DataGridRowDriverBase {
  private readonly _dataCellLocator: PartLocator;
  constructor(locator: PartLocator, interactor: Interactor, option?: Partial<IComponentDriverOption>) {
    super(locator, interactor, {
      ...option,
      parts: {},
    });

    this._dataCellLocator = locatorUtil.append(locator, byRole('cell'));
  }

  protected override getCellLocator(): PartLocator {
    return this._dataCellLocator;
  }

  override get driverName(): string {
    return 'MuiV6DataGridDataRowDriver';
  }
}
