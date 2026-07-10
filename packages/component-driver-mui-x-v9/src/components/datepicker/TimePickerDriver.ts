import { IComponentDriverOption, Interactor, PartLocator } from '@atomic-testing/core';

import { textEntryToTime, timeToTextEntry } from './dateUtil';
import { PickerFieldDriverBase } from './PickerFieldDriverBase';
import { DatePickerCharacteristic } from './types';

/**
 * Driver for the MUI X v9 desktop TimePicker.
 *
 * Reads and writes go through the section field ({@link PickerFieldDriverBase}): `setValue`
 * types the 12-hour time digits then the meridiem letter (`a`/`p`), which is the single
 * keystroke the meridiem section accepts. The returned `Date` is anchored on 1970-01-01 —
 * only the time-of-day carries meaning.
 * @see https://mui.com/x/react-date-pickers/time-picker/
 */
export class TimePickerDriver extends PickerFieldDriverBase<Date> {
  constructor(locator: PartLocator, interactor: Interactor, option?: Partial<IComponentDriverOption>) {
    const characteristic: DatePickerCharacteristic = {
      valueToTextEntry: timeToTextEntry,
      textEntryToValue: textEntryToTime,
      defaultFormat: 'hh:mm (a|p)m',
    };
    super(locator, interactor, characteristic, option);
  }

  get driverName(): string {
    return 'MuiV9TimePicker';
  }
}
