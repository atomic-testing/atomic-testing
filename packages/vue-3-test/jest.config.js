const base = require('../../jest.config.base.js');

module.exports = {
  ...base,
  testRegex: '(/__tests__/.*.dom.(test|spec)).(ts?)$',
  displayName: 'vue3-test',
  testEnvironment: 'jsdom',
  transform: {
    ...base.transform,
    '^.+\\.vue$': '<rootDir>/vue-jest-transform.js',
  },
  moduleFileExtensions: [...base.moduleFileExtensions, 'vue'],
  moduleNameMapper: {
    ...base.moduleNameMapper,
    '^@atomic-testing/vue-3$': '<rootDir>/../vue-3/src/index.ts',
    '^@atomic-testing/core$': '<rootDir>/../core/src/index.ts',
    '^@atomic-testing/dom-core$': '<rootDir>/../dom-core/src/index.ts',
    '^@atomic-testing/component-driver-html$': '<rootDir>/../component-driver-html/src/index.ts',
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
};
