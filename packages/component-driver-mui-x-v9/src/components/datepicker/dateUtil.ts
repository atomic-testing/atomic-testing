import { DateRange } from './types';

function padLeftZeroes(value: number, digits: number): string {
  return String(value).padStart(digits, '0');
}

/**
 * Parse a picker's committed value — the hidden input's locale-formatted string
 * (e.g. "06/27/2026") — into a Date, or null when the field is empty or the value cannot be
 * parsed. The explicit Invalid-Date guard avoids leaking `new Date('…')`'s implementation-defined
 * behaviour for malformed input.
 *
 * Like the v5 converters these assume the driver family's default (English/US) formats; the
 * `format` argument is reserved for locale-aware parsing.
 */
export function textEntryToDate(text: string, _format: string): Date | null {
  if (text.length < 6) {
    return null;
  }
  const parsed = new Date(text);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

/**
 * The keystroke stream that types a calendar date into a `MM/DD/YYYY` section field:
 * zero-padded month and day digits then the four year digits (e.g. `12252025`). Typing a
 * section's full digit width overwrites its previous value and auto-advances, so the streams
 * need no separators.
 */
export function dateToTextEntry(date: Date, _format: string): string {
  return `${padLeftZeroes(date.getMonth() + 1, 2)}${padLeftZeroes(date.getDate(), 2)}${padLeftZeroes(date.getFullYear(), 4)}`;
}

/**
 * The keystroke stream that types a 12-hour time into an `hh:mm aa` section field: zero-padded
 * hour and minute digits, then the meridiem section's single accepted letter (`a`/`p`).
 */
export function timeToTextEntry(date: Date, _format: string): string {
  const hours24 = date.getHours();
  const hours12 = ((hours24 + 11) % 12) + 1;
  const meridiemKey = hours24 < 12 ? 'a' : 'p';
  return `${padLeftZeroes(hours12, 2)}${padLeftZeroes(date.getMinutes(), 2)}${meridiemKey}`;
}

/**
 * The keystroke stream for a `MM/DD/YYYY hh:mm aa` datetime section field — the date stream
 * followed by the time stream (auto-advance carries typing across the date/time boundary).
 */
export function dateTimeToTextEntry(date: Date, format: string): string {
  return `${dateToTextEntry(date, format)}${timeToTextEntry(date, format)}`;
}

/**
 * Parse a time field's committed text (e.g. "09:30 AM") into a Date anchored on 1970-01-01
 * local time — only the time-of-day carries meaning. Returns null for empty/unparsable text.
 */
export function textEntryToTime(text: string, _format: string): Date | null {
  const match = /^(\d{1,2}):(\d{2})\s*([AP])M?$/i.exec(text.trim());
  if (match == null) {
    return null;
  }
  const [, hourText, minuteText, meridiem] = match;
  let hours = Number(hourText) % 12;
  if (meridiem.toUpperCase() === 'P') {
    hours += 12;
  }
  return new Date(1970, 0, 1, hours, Number(minuteText));
}

/**
 * Parse a datetime field's committed text (e.g. "12/25/2025 09:30 PM") into a Date, or null
 * when empty/unparsable. V8's parser accepts this en-US shape directly, so the same
 * Invalid-Date guard as {@link textEntryToDate} suffices.
 */
export function textEntryToDateTime(text: string, _format: string): Date | null {
  if (text.length < 12) {
    return null;
  }
  const parsed = new Date(text);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

// The range field joins its two dates with a spaced dash whose character varies by locale
// data (en dash today); accept en/em dashes and a plain hyphen.
const rangeSeparatorPattern = /\s+[–—-]\s+/;

/**
 * The keystroke stream for a single-input date range field — the start date's digits followed
 * by the end date's (auto-advance carries typing across the range separator). Both sides must
 * be present: the section field offers no way to type one side while skipping the other.
 */
export function dateRangeToTextEntry(range: DateRange, format: string): string {
  if (range.start == null || range.end == null) {
    throw new Error('dateRangeToTextEntry requires both start and end dates; to clear the field set the value to null');
  }
  return `${dateToTextEntry(range.start, format)}${dateToTextEntry(range.end, format)}`;
}

/**
 * Parse a range field's committed text (e.g. "12/25/2025 – 01/15/2026") into a {@link DateRange},
 * or null when the text does not contain a two-sided range.
 */
export function textEntryToDateRange(text: string, format: string): DateRange | null {
  const segments = text.split(rangeSeparatorPattern);
  if (segments.length !== 2) {
    return null;
  }
  return {
    start: textEntryToDate(segments[0].trim(), format),
    end: textEntryToDate(segments[1].trim(), format),
  };
}
