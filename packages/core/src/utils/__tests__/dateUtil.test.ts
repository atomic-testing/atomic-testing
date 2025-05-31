import {
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
    expect(() => validateHtmlDateInput('month', '2021-01')).toThrowError(
      'Unsupported date type: month',
    );
  });
});
