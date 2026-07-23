import { assertValidClickCount } from '../MouseOption';

describe('assertValidClickCount', () => {
  test('accepts undefined (a single click)', () => {
    expect(() => assertValidClickCount(undefined)).not.toThrow();
  });

  test('accepts 2 (a double-click)', () => {
    expect(() => assertValidClickCount(2)).not.toThrow();
  });

  test('rejects any other value, so every Interactor.click() implementation fails the same way', () => {
    expect(() => assertValidClickCount(1)).toThrow(/clickCount/);
    expect(() => assertValidClickCount(3)).toThrow(/clickCount/);
  });
});
