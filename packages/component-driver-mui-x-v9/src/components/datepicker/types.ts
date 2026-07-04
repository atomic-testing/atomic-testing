export interface DatePickerCharacteristic<TValue = Date> {
  /**
   * Convert a value into the keystroke stream typed into the picker's section
   * field — digit runs per section plus the meridiem letter, e.g. `12252025`
   * for 12/25/2025 or `0930p` for 9:30 PM. MUI auto-advances to the next
   * section as each section's digits commit, so the streams concatenate.
   */
  valueToTextEntry: (value: TValue, format: string) => string;
  /**
   * Parse the committed, locale-formatted field text (the hidden input's
   * mirrored value, e.g. "06/27/2026") back into a value, or `null` when the
   * text is empty or unparsable.
   */
  textEntryToValue: (text: string, format: string) => TValue | null;
  /**
   * Format hint displayed in the input field
   */
  defaultFormat: string;
}

/**
 * The value of a date range picker. Either side is `null` while that side of
 * the range is not committed.
 */
export interface DateRange {
  start: Date | null;
  end: Date | null;
}
