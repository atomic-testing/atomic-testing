export interface DatePickerCharacteristic {
  valueToTextEntry: (value: Date, format: string) => string;
  textEntryToValue: (text: string, format: string) => Date | null;
  /**
   * Format hint displayed in the input field
   */
  defaultFormat: string;
}

export type DateType = 'date' | 'time' | 'datetime';

export interface DateRangeInput {
  start: Date | null;
  end: Date | null;
  /**
   * Type of the date input, default to 'date'
   */
  type?: DateType;
}
