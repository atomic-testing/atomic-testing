import { IComponentDriverOption, Interactor, PartLocator } from '@atomic-testing/core';
import { DesktopDatePickerDriverBase } from './DesktopDatePickerDriverBase';
import { textEntryToTime, timeToTextEntry } from './dateUtil';
import { DatePickerCharacteristic } from './types';

export class TimePickerDriver extends DesktopDatePickerDriverBase {
  constructor(locator: PartLocator, interactor: Interactor, option?: Partial<IComponentDriverOption>) {
    const characteristic: DatePickerCharacteristic = {
      valueToTextEntry: timeToTextEntry,
      textEntryToValue: textEntryToTime,
      defaultFormat: 'hh:mm (a|pm)',
    };
    super(locator, interactor, characteristic, option);
  }

  get driverName(): string {
    return 'MuiV5TimePicker';
  }
}
