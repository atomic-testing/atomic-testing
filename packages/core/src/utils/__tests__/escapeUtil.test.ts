import { escapeCssClassName, escapeValue } from '../escapeUtil';

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
});
