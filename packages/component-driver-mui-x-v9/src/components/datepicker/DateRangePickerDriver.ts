import { IComponentDriverOption, Interactor, PartLocator } from '@atomic-testing/core';

import { dateRangeToTextEntry, textEntryToDateRange } from './dateUtil';
import { PickerFieldDriverBase } from './PickerFieldDriverBase';
import { DatePickerCharacteristic, DateRange } from './types';

/**
 * Driver for the MUI X v9 (Pro) DateRangePicker with its default single-input field.
 *
 * The field is one section list holding both dates' sections separated by a dash, mirrored by
 * one hidden input (e.g. `"06/27/2026 – 07/04/2026"`) — so the section-field mechanics of
 * {@link PickerFieldDriverBase} apply unchanged with a {@link DateRange} value. `setValue` types
 * the start date's digits then the end date's (auto-advance carries typing across the range
 * separator) and requires both sides; pass `null` to clear the whole field.
 * @see https://mui.com/x/react-date-pickers/date-range-picker/
 */
export class DateRangePickerDriver extends PickerFieldDriverBase<DateRange> {
  constructor(locator: PartLocator, interactor: Interactor, option?: Partial<IComponentDriverOption>) {
    const characteristic: DatePickerCharacteristic<DateRange> = {
      valueToTextEntry: dateRangeToTextEntry,
      textEntryToValue: textEntryToDateRange,
      defaultFormat: 'mm/dd/yyyy – mm/dd/yyyy',
    };
    super(locator, interactor, characteristic, option);
  }

  get driverName(): string {
    return 'MuiV9DateRangePicker';
  }
}
