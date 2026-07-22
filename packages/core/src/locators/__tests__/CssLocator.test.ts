import { byCssSelector } from '../byCssSelector';

describe('CssLocator', () => {
  it('defaults to the Descendant relative position', () => {
    const [locator] = byCssSelector('.item');
    expect(locator.relative).toBe('Descendant');
  });

  it('carries the relative position passed to the builder', () => {
    const [locator] = byCssSelector('.item', 'Root');
    expect(locator.relative).toBe('Root');
  });

  it('reports primitive complexity', () => {
    const [locator] = byCssSelector('.item');
    expect(locator.complexity).toBe('primitive');
  });

  describe('clone', () => {
    it('keeps the selector and relative position by default', () => {
      const [locator] = byCssSelector('.item', 'Same');
      const cloned = locator.clone();
      expect(cloned.selector).toBe('.item');
      expect(cloned.relative).toBe('Same');
    });

    it('overrides the relative position when supplied', () => {
      const [locator] = byCssSelector('.item', 'Same');
      const cloned = locator.clone({ relative: 'Root' });
      expect(cloned.relative).toBe('Root');
    });
  });
});
