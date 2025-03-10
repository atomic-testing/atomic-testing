const base = require('../../jest.config.base.js');

module.exports = {
  ...base,
  testRegex: '(/__tests__/.*.dom.(test|spec)).(jsx?|tsx?)$',
  displayName: 'component-driver-mui-x-v5',
  testEnvironment: 'jsdom',
};
