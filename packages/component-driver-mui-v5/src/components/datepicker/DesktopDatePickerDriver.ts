import { IComponentDriverOption, Interactor, PartLocator } from '@atomic-testing/core';
import { DesktopDatePickerDriverBase } from './DesktopDatePickerDriverBase';
import { dateToTextEntry, textEntryToDate } from './dateUtil';
import { DatePickerCharacteristic } from './types';

export class DesktopDatePickerDriver extends DesktopDatePickerDriverBase {
  constructor(locator: PartLocator, interactor: Interactor, option?: Partial<IComponentDriverOption>) {
    const characteristic: DatePickerCharacteristic = {
      valueToTextEntry: dateToTextEntry,
      textEntryToValue: textEntryToDate,
      defaultFormat: 'mm/dd/yyyy',
    };
    super(locator, interactor, characteristic, option);
  }

  get driverName(): string {
    return 'MuiV5DesktopDatePicker';
  }
}
