import { IComponentDriverOption, Interactor, PartLocator } from '@atomic-testing/core';

import { textEntryToDate } from './dateUtil';
import { DesktopDatePickerDriverBase } from './DesktopDatePickerDriverBase';
import { DatePickerCharacteristic } from './types';

export class DesktopDatePickerDriver extends DesktopDatePickerDriverBase {
  constructor(locator: PartLocator, interactor: Interactor, option?: Partial<IComponentDriverOption>) {
    const characteristic: DatePickerCharacteristic = {
      textEntryToValue: textEntryToDate,
      defaultFormat: 'mm/dd/yyyy',
    };
    super(locator, interactor, characteristic, option);
  }

  get driverName(): string {
    return 'MuiV9DesktopDatePicker';
  }
}
