const base = require('../../jest.config.base.js');

module.exports = {
  ...base,
  testRegex: '(/__tests__/.*.dom.(test|spec)).(ts)$',
  displayName: 'angular16-test',
  testEnvironment: 'jsdom',
};
