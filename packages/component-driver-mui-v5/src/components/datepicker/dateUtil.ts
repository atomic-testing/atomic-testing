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

export function textEntryToDate(text: string, format: string): Date {
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
