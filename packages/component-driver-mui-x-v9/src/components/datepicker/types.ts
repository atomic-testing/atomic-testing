export interface DatePickerCharacteristic {
  textEntryToValue: (text: string, format: string) => Date | null;
  /**
   * Format hint displayed in the input field
   */
  defaultFormat: string;
}
