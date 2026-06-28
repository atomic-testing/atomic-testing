import { byRole, IComponentDriverOption, Interactor, locatorUtil, PartLocator } from '@atomic-testing/core';

import { DataGridRowDriverBase } from './DataGridRowDriverBase';

export class DataGridDataRowDriver extends DataGridRowDriverBase {
  private readonly _dataCellLocator: PartLocator;
  constructor(locator: PartLocator, interactor: Interactor, option?: Partial<IComponentDriverOption>) {
    super(locator, interactor, {
      ...option,
      parts: {},
    });

    // v9 body cells are role="gridcell" (.MuiDataGrid-cell); the surrounding offset divs are
    // role="none". (Earlier majors' role="cell" matches nothing here.)
    this._dataCellLocator = locatorUtil.append(locator, byRole('gridcell'));
  }

  protected override getCellLocator(): PartLocator {
    return this._dataCellLocator;
  }

  override get driverName(): string {
    return 'MuiV9DataGridDataRowDriver';
  }
}
