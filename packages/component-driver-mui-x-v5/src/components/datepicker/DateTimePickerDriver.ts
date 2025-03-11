import { IComponentDriverOption, Interactor, PartLocator } from '@atomic-testing/core';

import { DesktopDatePickerDriverBase } from './DesktopDatePickerDriverBase';
import { dateTimeToTextEntry, textEntryToDateTime } from './dateUtil';
import { DatePickerCharacteristic } from './types';

export class DateTimePickerDriver extends DesktopDatePickerDriverBase {
  constructor(locator: PartLocator, interactor: Interactor, option?: Partial<IComponentDriverOption>) {
    const characteristic: DatePickerCharacteristic = {
      valueToTextEntry: dateTimeToTextEntry,
      textEntryToValue: textEntryToDateTime,
      defaultFormat: 'mm/dd/yyyy hh:mm (a|pm)',
    };
    super(locator, interactor, characteristic, option);
  }

  get driverName(): string {
    return 'MuiV5DateTimePicker';
  }
}
