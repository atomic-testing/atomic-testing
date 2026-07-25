import { escapeCssClassName, escapeCssIdentifier, escapeCssString, escapeValue } from '../escapeUtil';

// Written with String.fromCharCode so the literals stay visible in the source rather
// than becoming invisible control characters.
const NUL = String.fromCharCode(0x0);
const UNIT_SEPARATOR = String.fromCharCode(0x1f);
const DELETE = String.fromCharCode(0x7f);

describe('escapeCssIdentifier', () => {
  test('should escape a leading digit as a code point, since a backslash would re-read as the digit', () => {
    expect(escapeCssIdentifier('1abc')).toBe('\\31 abc');
  });

  test('should escape a digit that follows a leading hyphen', () => {
    expect(escapeCssIdentifier('-1abc')).toBe('-\\31 abc');
  });

  test('should not escape a digit anywhere else', () => {
    expect(escapeCssIdentifier('abc1')).toBe('abc1');
    expect(escapeCssIdentifier('--1abc')).toBe('--1abc');
  });

  test('should escape a lone hyphen, which tokenizes as a delimiter rather than an identifier', () => {
    expect(escapeCssIdentifier('-')).toBe('\\-');
  });

  test('should leave a hyphen that starts a longer identifier alone', () => {
    expect(escapeCssIdentifier('-abc')).toBe('-abc');
  });

  test('should return the empty string unchanged, as it has no valid identifier form', () => {
    expect(escapeCssIdentifier('')).toBe('');
  });

  test('should replace U+0000, which has no escape sequence', () => {
    expect(escapeCssIdentifier(`a${NUL}b`)).toBe('a�b');
  });

  test('should escape control characters as code points', () => {
    expect(escapeCssIdentifier(`a${UNIT_SEPARATOR}b`)).toBe('a\\1f b');
    expect(escapeCssIdentifier(`a${DELETE}b`)).toBe('a\\7f b');
    expect(escapeCssIdentifier('a\nb')).toBe('a\\a b');
  });

  test('should backslash-escape punctuation, including quotes and backslashes', () => {
    expect(escapeCssIdentifier('a"b')).toBe('a\\"b');
    expect(escapeCssIdentifier('a\\b')).toBe('a\\\\b');
  });

  test('should backslash-escape a space', () => {
    expect(escapeCssIdentifier('a b')).toBe('a\\ b');
  });

  test('should escape an attribute name containing a space', () => {
    expect(escapeCssIdentifier('data-my attr')).toBe('data-my\\ attr');
  });

  test('should escape an attribute name containing a colon', () => {
    expect(escapeCssIdentifier('xlink:href')).toBe('xlink\\:href');
  });

  test('should keep hyphens, underscores and non-ASCII characters verbatim', () => {
    expect(escapeCssIdentifier('a-b_c')).toBe('a-b_c');
    expect(escapeCssIdentifier('café')).toBe('café');
    expect(escapeCssIdentifier('emoji-🎉')).toBe('emoji-🎉');
  });
});

describe('escapeCssString', () => {
  test('should escape double quotes, which would otherwise close the string', () => {
    expect(escapeCssString('say "hi"')).toBe('say \\"hi\\"');
  });

  test('should escape backslashes', () => {
    expect(escapeCssString('a\\b')).toBe('a\\\\b');
  });

  test('should escape newlines, which terminate a CSS string outright', () => {
    expect(escapeCssString('a\nb')).toBe('a\\a b');
  });

  test('should escape other control characters as code points', () => {
    expect(escapeCssString(`a${UNIT_SEPARATOR}b`)).toBe('a\\1f b');
    expect(escapeCssString(`a${DELETE}b`)).toBe('a\\7f b');
  });

  test('should replace U+0000, which has no escape sequence', () => {
    expect(escapeCssString(`a${NUL}b`)).toBe('a�b');
  });

  test('should leave selector metacharacters alone: inside a quoted string they are literal', () => {
    expect(escapeCssString('color-0-#000000')).toBe('color-0-#000000');
    expect(escapeCssString(':r0:-listbox')).toBe(':r0:-listbox');
    expect(escapeCssString('w-[100px]')).toBe('w-[100px]');
  });

  test('should leave spaces and leading digits alone, unlike identifier position', () => {
    expect(escapeCssString('a b')).toBe('a b');
    expect(escapeCssString('1abc')).toBe('1abc');
    expect(escapeCssString('-')).toBe('-');
  });

  test('should return the empty string unchanged', () => {
    expect(escapeCssString('')).toBe('');
  });
});

describe('escapeCssClassName', () => {
  test('should escape Tailwind-style class names with colons', () => {
    expect(escapeCssClassName('hover:bg-blue-500')).toBe('hover\\:bg-blue-500');
  });

  test('should escape class names with dots', () => {
    expect(escapeCssClassName('text-1.5')).toBe('text-1\\.5');
  });

  test('should escape class names with brackets', () => {
    expect(escapeCssClassName('w-[100px]')).toBe('w-\\[100px\\]');
  });

  test('should escape class names with slashes', () => {
    expect(escapeCssClassName('w-1/2')).toBe('w-1\\/2');
  });

  test('should not escape simple class names', () => {
    expect(escapeCssClassName('my-class')).toBe('my-class');
  });

  test('should escape multiple special characters', () => {
    expect(escapeCssClassName('hover:focus:bg-[#fff]')).toBe('hover\\:focus\\:bg-\\[\\#fff\\]');
  });

  test('should escape a Tailwind arbitrary-variant class combining colons and brackets', () => {
    expect(escapeCssClassName('lg:[&>*]:mt-2')).toBe('lg\\:\\[\\&\\>\\*\\]\\:mt-2');
  });
});

describe('escapeValue', () => {
  test('should alias the quoted-string escaper it was retained for', () => {
    for (const value of ['plain', 'a"b', 'a\\b', 'a b', '1abc', 'hover:bg-blue']) {
      expect(escapeValue(value)).toBe(escapeCssString(value));
    }
  });
});
