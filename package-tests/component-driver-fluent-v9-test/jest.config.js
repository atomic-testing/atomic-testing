const base = require('../../jest.config.base.js');

module.exports = {
  ...base,
  testRegex: '(/__tests__/.*.dom.(test|spec)).(jsx?|tsx?)$',
  displayName: 'component-driver-fluent-v9-test',
  testEnvironment: 'jsdom',
};
