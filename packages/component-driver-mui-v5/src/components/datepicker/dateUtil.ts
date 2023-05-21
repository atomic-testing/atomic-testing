import dayjs from 'dayjs';
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

export function dateToTextEntry(date: Date, format: string): string {
  // assume mmddyyyy for now
  const monthPart = padLeftZeroes(`${date.getMonth() + 1}`, 2);
  const datePart = padLeftZeroes(`${date.getDate()}`, 2);
  const yearPart = `${date.getFullYear()}`;

  return monthPart + datePart + yearPart;
}

export function textEntryToDate(text: string, format: string): Date | null {
  if (text.length < 6) {
    return null;
  }
  return new Date(text);
}

export function timeToTextEntry(date: Date, format: string): string {
  // assume hh:mm a|pm for now
  return dayjs(date).format('hhmmA');
}

export function textEntryToTime(text: string, format: string): Date | null {
  if (text.length < 3) {
    return null;
  }
  const datePart = dayjs().format('YYYY-MM-DD');
  return new Date(`${datePart} ${text}`);
}

export function dateTimeToTextEntry(date: Date, format: string): string {
  return dayjs(date).format('YYYYMMDDhhmmA');
}

export function textEntryToDateTime(text: string, format: string): Date | null {
  // assume YYYY/MM/DD hh:mm for now
  if (text.length < 12) {
    return null;
  }
  return new Date(text);
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
