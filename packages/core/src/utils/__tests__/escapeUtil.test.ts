import { escapeValue } from '../escapeUtil';

describe('escapeValue', () => {
  test('should escape special characters such as #', () => {
    expect(escapeValue('color-0-#000000')).toBe('color-0-\\#000000');
  });

  test('should escape special characters such as :', () => {
    expect(escapeValue(':r0:-listbox')).toBe('\\:r0\\:-listbox');
  });

  test('should not escape value without special character', () => {
    expect(escapeValue('abc')).toBe('abc');
  });
});
