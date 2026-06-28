/**
 * A data type that describes what should be included with the date
 */
export interface DateTimePart {
  withDate: boolean;
  withTime: boolean;
}

export const dateOnly: Readonly<DateTimePart> = Object.freeze({
  withDate: true,
  withTime: false,
});

/**
 * Convert a Date into the MMDDYYYY digit sequence a desktop date picker accepts when typed
 * section-by-section. The portable section-typing write path (and the time/datetime/range
 * conversions) are tracked as a follow-up; only the read direction ships today.
 */
export function dateToTextEntry(date: Date, _format: string): string {
  const monthPart = padLeftZeroes(`${date.getMonth() + 1}`, 2);
  const datePart = padLeftZeroes(`${date.getDate()}`, 2);
  const yearPart = `${date.getFullYear()}`;

  return monthPart + datePart + yearPart;
}

/**
 * Parse a desktop date picker's committed value — the hidden input's locale-formatted string
 * (e.g. "06/27/2026") — into a Date, or null when the field is empty or the value cannot be
 * parsed. The explicit Invalid-Date guard avoids leaking `new Date('…')`'s implementation-defined
 * behaviour for malformed input.
 */
export function textEntryToDate(text: string, _format: string): Date | null {
  if (text.length < 6) {
    return null;
  }
  const parsed = new Date(text);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

/**
 * Return numeric text with padding zero's to guarantee the number of digits
 * @param number
 * @param digits
 */
export function padLeftZeroes(number: string, digits: number): string {
  const result = number.toString().split('.')[0];
  const len = result.length;
  if (len >= digits) {
    return result;
  }
  const padZeroes = getZeroes(digits - len);
  return padZeroes + result;
}

const zeroesCache: Map<number, string> = new Map();
export function getZeroes(count: number): string {
  if (zeroesCache.has(count)) {
    return zeroesCache.get(count)!;
  }

  let result = '';
  for (let i = 0; i < count; i++) {
    result += '0';
  }

  zeroesCache.set(count, result);
  return result;
}
