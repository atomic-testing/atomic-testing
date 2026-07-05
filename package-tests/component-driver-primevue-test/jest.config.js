const base = require('../../jest.config.base.js');

module.exports = {
  ...base,
  testRegex: '(/__tests__/.*.dom.(test|spec)).(jsx?|tsx?)$',
  displayName: 'component-driver-primevue-test',
  testEnvironment: 'jsdom',
  // jest-environment-jsdom resolves the `browser` export condition by default,
  // which hands @vue/test-utils' browser UMD (expecting a global `Vue`) to a
  // CJS require. The Vue ecosystem's canonical jest fix: resolve `node`
  // conditions instead.
  testEnvironmentOptions: {
    customExportConditions: ['node', 'node-addons'],
  },
  setupFiles: ['<rootDir>/jest.setup.ts'],
  // The base config only transforms the package's own .ts/.tsx. PrimeVue 4 (and
  // the @primeuix runtime packages behind it) ship ESM-only .mjs that jest
  // cannot parse untransformed, so jest must also transform their .js/.mjs —
  // hence the extra transform rule plus the transformIgnorePatterns exception
  // below (the `.*` lookahead is pnpm-real-path safe). Everything else in
  // node_modules stays untransformed.
  transform: {
    ...base.transform,
    '^.+\\.(js|mjs)$': '@swc/jest',
  },
  transformIgnorePatterns: ['/node_modules/(?!.*(?:primevue|@primevue|@primeuix))'],
};
