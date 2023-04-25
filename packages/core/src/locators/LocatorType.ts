export type LocatorType = 'css' | 'xpath';

export const LocatorTypeLookup: Record<string, LocatorType> = Object.freeze({
  Css: 'css',
  Xpath: 'xpath',
});
