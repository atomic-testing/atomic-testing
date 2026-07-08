const dateRegex: RegExp = /^(19[0-9]{2}|2[0-9]{3})-(0[1-9]|1[012])-([123]0|[012][1-9]|31)$/;
const timeRegex: RegExp = /^([01][0-9]|2[0-3]):([0-5][0-9])$/;

export function isHtmlInputDateFormat(input: string): boolean {
  if (!dateRegex.test(input)) {
    return false;
  }

  // Parse the date to check if it is a valid date (considering leap years).
  const [year, month, date] = input.split('-');
  const parsed = new Date(parseInt(year), parseInt(month) - 1, parseInt(date));
  const dateYear = parsed.getFullYear().toString().padStart(4, '0');
  const dateMonth = (parsed.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-based.
  const dateDay = parsed.getDate().toString().padStart(2, '0');

  // Reconstruct the date string and compare it to the input.
  const isoDateString = `${dateYear}-${dateMonth}-${dateDay}`;
  return input === isoDateString;
}

export function isHtmlInputTimeFormat(input: string): boolean {
  return timeRegex.test(input);
}

/**
 * Whether the input is in the format of an HTML input datetime-local.
 * @param input
 * @returns
 */
export function isHtmlInputDateTimeFormat(input: string): boolean {
  const dateTimeParts = input.split('T');
  if (dateTimeParts.length !== 2) {
    return false;
  }

  return isHtmlInputDateFormat(dateTimeParts[0]) && isHtmlInputTimeFormat(dateTimeParts[1]);
}

/**
 * Supported html input date types
 */
export const htmlInputDateTypes: readonly string[] = ['date', 'datetime-local', 'time'] as const;
export type HtmlInputDateType = (typeof htmlInputDateTypes)[number];
const htmlInputDateSet: Set<string> = new Set(htmlInputDateTypes);

export interface IDateValidationDescriptor {
  type: HtmlInputDateType;
  validate: (input: string) => boolean;
  format: string;
  example: string;
}

const dateValidationDescriptors: Record<HtmlInputDateType, IDateValidationDescriptor> = {
  date: {
    type: 'date',
    validate: isHtmlInputDateFormat,
    format: 'YYYY-MM-DD',
    example: '2021-01-01',
  },
  'datetime-local': {
    type: 'datetime-local',
    validate: isHtmlInputDateTimeFormat,
    format: 'YYYY-MM-DDThh:mm',
    example: '2021-01-01T15:30',
  },
  time: {
    type: 'time',
    validate: isHtmlInputTimeFormat,
    format: 'hh:mm',
    example: '15:30',
  },
};

export interface DateValidationSuccessResult {
  valid: true;
}

export interface DateValidationFailureResult {
  valid: false;
  format: string;
  example: string;
}

export type DateValidationResult = DateValidationSuccessResult | DateValidationFailureResult;

export function isHtmlDateInputType(type: string): type is HtmlInputDateType {
  return htmlInputDateSet.has(type);
}

export function validateHtmlDateInput(type: string, input: string): DateValidationResult {
  if (!isHtmlDateInputType(type)) {
    throw new Error(`Unsupported date type: ${type}`);
  }
  const descriptor = dateValidationDescriptors[type];

  if (descriptor.validate(input)) {
    return { valid: true };
  }

  return {
    valid: false,
    format: descriptor.format,
    example: descriptor.example,
  };
}

/**
 * Guard the `enterText` path: throw a descriptive error when `value` is being
 * entered into a date/time/datetime-local input in the wrong format.
 *
 * WHY it lives here (#1053): this is environment-agnostic policy — the SAME rule
 * applies whether text is typed via `userEvent` (jsdom) or `fill` (Playwright).
 * Both `DOMInteractor.enterText` and `PlaywrightInteractor.enterText` used to
 * inline this validate-and-throw block, which had drifted: only the DOM leg
 * short-circuited the empty string, so `enterText('')` on a date input threw
 * "Invalid date format" in Playwright but cleared the field in jsdom. Hoisting
 * the policy here — including the empty-string carve-out — makes both adapters
 * behave identically on the same input.
 *
 * An empty `value` is a pure clear (there is nothing to validate) and a
 * non-date `type` is not our concern, so both are accepted as no-ops.
 *
 * @param type - The input's `type` attribute (e.g. `'date'`, `'text'`).
 * @param value - The text about to be entered.
 * @throws {Error} If `type` is a date input type and `value` is a non-empty,
 *   badly-formatted string.
 */
export function assertValidHtmlDateInputValue(type: string, value: string): void {
  if (value === '' || !isHtmlDateInputType(type)) {
    return;
  }
  const result = validateHtmlDateInput(type, value);
  if (!result.valid) {
    throw new Error(
      `Invalid date format for type: ${type}, expected format: ${result.format}, example: ${result.example}`
    );
  }
}
