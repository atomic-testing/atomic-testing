module.exports = {
  roots: ['<rootDir>/src'],
  transform: {
    '^.+\\.ts$': '@swc/jest',
    '^.+\\.tsx$': [
      '@swc/jest',
      {
        jsc: {
          transform: {
            react: {
              runtime: 'automatic'
            }
          }
        }
      }
    ]
  },
  testRegex: '(/__tests__/.*.(test)).(jsx?|tsx?)$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  collectCoverage: false,
  verbose: true,
  testTimeout: 30000,
  testEnvironment: 'jsdom',
  globals: {
    IS_REACT_ACT_ENVIRONMENT: true
  }
};
