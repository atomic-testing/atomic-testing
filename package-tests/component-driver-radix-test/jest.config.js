const base = require('../../jest.config.base.js');

module.exports = {
  ...base,
  testRegex: '(/__tests__/.*.dom.(test|spec)).(jsx?|tsx?)$',
  displayName: 'component-driver-radix-test',
  testEnvironment: 'jsdom',
  setupFiles: ['<rootDir>/jest.setup.ts'],
  // The base config only transforms the package's own .ts/.tsx. The unified
  // `radix-ui` package (and the per-primitive `@radix-ui/react-*` packages it
  // re-exports) ships ESM that jest cannot parse untransformed, so jest must
  // also transform their .js/.mjs — hence the extra transform rule plus the
  // transformIgnorePatterns exception below (the `.*` lookahead is
  // pnpm-real-path safe). Everything else in node_modules stays untransformed.
  transform: {
    ...base.transform,
    '^.+\\.(js|mjs)$': '@swc/jest',
  },
  transformIgnorePatterns: ['/node_modules/(?!.*(?:radix-ui|@radix-ui|@floating-ui|aria-hidden|react-remove-scroll))'],
};
