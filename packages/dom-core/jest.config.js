const base = require('../../jest.config.base.js');

module.exports = {
  ...base,
  roots: ['<rootDir>/__tests__'],
  testEnvironment: 'jsdom',
  displayName: 'dom-core',
};
