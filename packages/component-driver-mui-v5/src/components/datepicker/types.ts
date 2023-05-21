export interface DatePickerCharacteristic {
  valueToTextEntry: (value: Date, format: string) => string;
  textEntryToValue: (text: string, format: string) => Date | null;
  /**
   * Format hint displayed in the input field
   */
  defaultFormat: string;
}
