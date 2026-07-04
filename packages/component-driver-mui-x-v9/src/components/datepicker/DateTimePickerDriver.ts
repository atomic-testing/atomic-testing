import { IComponentDriverOption, Interactor, PartLocator } from '@atomic-testing/core';

import { dateTimeToTextEntry, textEntryToDateTime } from './dateUtil';
import { PickerFieldDriverBase } from './PickerFieldDriverBase';
import { DatePickerCharacteristic } from './types';

/**
 * Driver for the MUI X v9 desktop DateTimePicker.
 *
 * Reads and writes go through the section field ({@link PickerFieldDriverBase}): `setValue`
 * types the date digits, then the time digits, then the meridiem letter (`a`/`p`) — MUI
 * auto-advances across the date/time boundary. The popup (calendar + digital clock) is a
 * multi-step surface, so the keystroke path is the write path here.
 * @see https://mui.com/x/react-date-pickers/date-time-picker/
 */
export class DateTimePickerDriver extends PickerFieldDriverBase<Date> {
  constructor(locator: PartLocator, interactor: Interactor, option?: Partial<IComponentDriverOption>) {
    const characteristic: DatePickerCharacteristic = {
      valueToTextEntry: dateTimeToTextEntry,
      textEntryToValue: textEntryToDateTime,
      defaultFormat: 'mm/dd/yyyy hh:mm (a|p)m',
    };
    super(locator, interactor, characteristic, option);
  }

  get driverName(): string {
    return 'MuiV9DateTimePicker';
  }
}
