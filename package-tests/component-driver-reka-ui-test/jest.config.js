const base = require('../../jest.config.base.js');

module.exports = {
  ...base,
  testRegex: '(/__tests__/.*.dom.(test|spec)).(jsx?|tsx?)$',
  displayName: 'component-driver-reka-ui-test',
  testEnvironment: 'jsdom',
  // jest-environment-jsdom resolves the `browser` export condition by default,
  // which hands @vue/test-utils' browser UMD (expecting a global `Vue`) to a
  // CJS require. The Vue ecosystem's canonical jest fix: resolve `node`
  // conditions instead.
  testEnvironmentOptions: {
    customExportConditions: ['node', 'node-addons'],
  },
  setupFiles: ['<rootDir>/jest.setup.ts'],
  // The base config only transforms the package's own .ts/.tsx. reka-ui ships
  // ESM-only .mjs that jest cannot parse untransformed, so jest must also
  // transform its .js/.mjs — hence the extra transform rule plus the
  // transformIgnorePatterns exception below (mirrors component-driver-primevue-test).
  transform: {
    ...base.transform,
    '^.+\\.(js|mjs)$': '@swc/jest',
  },
  transformIgnorePatterns: ['/node_modules/(?!.*(?:reka-ui|@vueuse|ohash))'],
};
