const base = require('../../jest.config.base.js');

module.exports = {
  ...base,
  testRegex: '(/__tests__/.*.dom.(test|spec)).(ts?)$',
  displayName: 'vue3-test',
  testEnvironment: 'jsdom',
};
