const base = require('../../jest.config.base.js');

module.exports = {
  ...base,
  testRegex: '(/__tests__/.*.dom.(test|spec)).(jsx?|tsx?)$',
  displayName: 'component-driver-astryx-test',
  testEnvironment: 'jsdom',
  // Polyfill the native Popover API jsdom lacks (Astryx tooltips use it). See jest.setup.ts.
  setupFiles: ['<rootDir>/jest.setup.ts'],
  // The base config only transforms the package's own .ts/.tsx. @astryxdesign/core
  // ships ESM-only, so jest must also transform its (and the StyleX runtime's)
  // .js/.mjs — hence the extra transform rule plus the transformIgnorePatterns
  // exception below. Astryx 0.1.7 added component translation (useTranslator),
  // pulling in `intl-messageformat` and its `@formatjs/*` dependencies
  // (fast-memoize, icu-messageformat-parser, icu-skeleton-parser) — also
  // ESM-only — so they need the same exception. Everything else in node_modules
  // stays untransformed.
  transform: {
    ...base.transform,
    '^.+\\.(js|mjs)$': '@swc/jest',
  },
  transformIgnorePatterns: ['/node_modules/(?!.*(?:@astryxdesign|@stylexjs|intl-messageformat|@formatjs))'],
  moduleNameMapper: {
    ...base.moduleNameMapper,
    '\\.(css|less)$': '<rootDir>/src/__mocks__/styleMock.ts',
  },
};
