import { byAriaLabel } from '../byAriaLabel';
import { byAttribute } from '../byAttribute';
import { byCssClass } from '../byCssClass';
import { byDataTestId } from '../byDataTestId';
import { byInputType } from '../byInputType';
import { byName } from '../byName';
import { byRole } from '../byRole';
import { byValue } from '../byValue';
import type { PartLocator } from '../PartLocator';

/**
 * Every locator here emits a CSS selector by interpolating caller-supplied text, and CSS
 * has two escaping contexts with different rules. These tests pin which helper each
 * interpolation site uses, because picking the wrong one fails silently — an
 * over-escaped value still matches (the string parser collapses the escape again), so
 * only the pathological inputs below expose the mistake.
 */
function selectorOf(locator: PartLocator): string {
  return locator.map(part => (part as { selector: string }).selector).join(' ');
}

describe('identifier-position escaping', () => {
  test('should escape an id that starts with a digit, which is otherwise an invalid selector', () => {
    expect(selectorOf(byAttribute('id', '1abc'))).toBe('#\\31 abc');
  });

  test('should escape an id that starts with a hyphen followed by a digit', () => {
    expect(selectorOf(byAttribute('id', '-1abc'))).toBe('#-\\31 abc');
  });

  test('should escape an id that is a lone hyphen', () => {
    expect(selectorOf(byAttribute('id', '-'))).toBe('#\\-');
  });

  test('should escape a space inside an id', () => {
    expect(selectorOf(byAttribute('id', 'a b'))).toBe('#a\\ b');
  });

  test('should escape an attribute name containing a space', () => {
    // Previously URI-encoded to `[data-my%20attr="x"]`, which the CSS parser rejects.
    expect(selectorOf(byAttribute('data-my attr', 'x'))).toBe('[data-my\\ attr="x"]');
  });

  test('should escape an attribute name containing a colon', () => {
    expect(selectorOf(byAttribute('xlink:href', 'x'))).toBe('[xlink\\:href="x"]');
  });

  test('should escape a Tailwind-style class name', () => {
    expect(selectorOf(byCssClass('hover:bg-blue-500'))).toBe('.hover\\:bg-blue-500');
    expect(selectorOf(byCssClass('w-[100px]'))).toBe('.w-\\[100px\\]');
  });

  test('should escape a class name starting with a digit', () => {
    expect(selectorOf(byCssClass('1col'))).toBe('.\\31 col');
  });

  test('should chain multiple class names', () => {
    expect(selectorOf(byCssClass(['lg:flex', 'gap-2']))).toBe('.lg\\:flex.gap-2');
  });
});

describe('quoted-string-position escaping', () => {
  test('should escape a double quote so it cannot close the selector string', () => {
    expect(selectorOf(byDataTestId('a"b'))).toBe('[data-testid="a\\"b"]');
  });

  test('should escape a backslash', () => {
    expect(selectorOf(byDataTestId('a\\b'))).toBe('[data-testid="a\\\\b"]');
  });

  test('should escape a newline, which would terminate the string mid-selector', () => {
    expect(selectorOf(byDataTestId('a\nb'))).toBe('[data-testid="a\\a b"]');
  });

  test('should leave selector metacharacters literal, since they carry no meaning here', () => {
    expect(selectorOf(byDataTestId('a.b:c'))).toBe('[data-testid="a.b:c"]');
    expect(selectorOf(byAttribute('data-x', 'a b'))).toBe('[data-x="a b"]');
  });

  test('should chain an array of test ids as descendants', () => {
    expect(selectorOf(byDataTestId(['list', 'item "1"']))).toBe('[data-testid="list"] [data-testid="item \\"1\\""]');
  });

  test.each([
    ['byValue', byValue, '[value="a\\"b"]'],
    ['byName', byName, '[name="a\\"b"]'],
    ['byRole', byRole, '[role="a\\"b"]'],
    ['byAriaLabel', byAriaLabel, '[aria-label="a\\"b"]'],
    ['byInputType', byInputType, 'input[type="a\\"b"]'],
  ])('%s should escape its value for quoted-string position', (_name, build, expected) => {
    expect(selectorOf(build('a"b'))).toBe(expected);
  });
});
