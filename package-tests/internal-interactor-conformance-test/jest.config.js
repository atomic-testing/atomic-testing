const base = require('../../jest.config.base.js');

module.exports = {
  ...base,
  // This package has no `src` — only the __tests__ adapters that run the shared
  // conformance suite — so scope roots to __tests__ to avoid a missing-root warning.
  roots: ['<rootDir>/__tests__'],
  testRegex: '(/__tests__/.*.dom.(test|spec)).(ts?)$',
  displayName: 'internal-interactor-conformance-test',
  testEnvironment: 'jsdom',
};
