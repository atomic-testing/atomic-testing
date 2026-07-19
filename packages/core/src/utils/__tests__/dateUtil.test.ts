import {
  assertValidHtmlDateInputValue,
  isHtmlInputDateFormat,
  isHtmlInputDateTimeFormat,
  isHtmlInputTimeFormat,
  validateHtmlDateInput,
} from '../dateUtil';

describe('isHtmlInputDateFormat', () => {
  test.each([
    ['2021-01-01', true],
    ['2021-01-01T15:30', false],
    ['15:30', false],
    ['2021-01-32', false],
    ['2020-02-29', true], // Leap year
    ['2021-02-29', false], // Non leap year
  ])('%s should validated as %p', (input, expected) => {
    expect(isHtmlInputDateFormat(input)).toBe(expected);
  });
});

describe('isHtmlInputTimeFormat', () => {
  test.each([
    ['2021-01-01', false],
    ['2021-01-01T15:30', false],
    ['15:30:12', false],
    ['03:30PM', false],
    ['15:30', true],
    ['00:00', true],
    ['02:30', true],
    ['23:59', true],
    ['23:60', false],
    ['23:100', false],
    ['24:01', false],
  ])('%s should validated as %p', (input, expected) => {
    expect(isHtmlInputTimeFormat(input)).toBe(expected);
  });
});

describe('isHtmlInputDateTimeFormat', () => {
  test.each([
    ['2021-01-01', false],
    ['2021-01-01T15:30', true],
    ['15:30', false],
  ])('%s should validated as %p', (input, expected) => {
    expect(isHtmlInputDateTimeFormat(input)).toBe(expected);
  });
});

describe('validateHtmlDateInput', () => {
  test.each([
    ['date', '2021-01-01', true],
    ['datetime-local', '2021-01-01T15:30', true],
    ['time', '15:30', true],
    ['datetime-local', '2021-01-01', false],
    ['date', '2021-01-01T15:30', false],
    ['date', '15:30', false],
  ])('type: %s with value %s should validated as %p', (type, input, expected) => {
    expect(validateHtmlDateInput(type, input).valid).toBe(expected);
  });

  test('should throw an error for unsupported type', () => {
    expect(() => validateHtmlDateInput('month', '2021-01')).toThrow('Unsupported date type: month');
  });
});

describe('assertValidHtmlDateInputValue', () => {
  test.each([
    ['date', '2021-01-01'],
    ['datetime-local', '2021-01-01T15:30'],
    ['time', '15:30'],
  ])('accepts a well-formed %s value', (type, value) => {
    expect(() => assertValidHtmlDateInputValue(type, value)).not.toThrow();
  });

  test.each([
    ['date', 'not-a-date'],
    ['time', '99:99'],
    ['datetime-local', '2021-01-01'],
  ])('throws for a malformed %s value', (type, value) => {
    expect(() => assertValidHtmlDateInputValue(type, value)).toThrow(`Invalid date format for type: ${type}`);
  });

  // The empty-string carve-out is the #1053 drift fix: clearing a date input
  // (`enterText('')`) must be a no-op for validation, so both interactors agree.
  test.each(['date', 'time', 'datetime-local', 'text'])('accepts an empty value for a %s input (pure clear)', type => {
    expect(() => assertValidHtmlDateInputValue(type, '')).not.toThrow();
  });

  test.each([
    ['text', 'anything'],
    ['number', '42'],
  ])('ignores non-date input types (%s)', (type, value) => {
    expect(() => assertValidHtmlDateInputValue(type, value)).not.toThrow();
  });
});
