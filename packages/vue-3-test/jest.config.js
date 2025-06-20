const base = require('../../jest.config.base.js');

module.exports = {
  ...base,
  testRegex: '(/__tests__/.*.dom.(test|spec)).(ts?)$',
  displayName: 'vue3-test',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '^@atomic-testing/vue-3$': '<rootDir>/../vue-3/src',
    '^@atomic-testing/core$': '<rootDir>/../core/src',
    '^@atomic-testing/dom-core$': '<rootDir>/../dom-core/src',
    '^@atomic-testing/component-driver-html$': '<rootDir>/../component-driver-html/src',
  },
};
