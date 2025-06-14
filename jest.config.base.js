const path = require('path');
const { lstatSync, readdirSync } = require('fs');
// get listing of packages in the mono repo
const basePath = path.resolve(__dirname, 'packages');
const packages = readdirSync(basePath).filter(name => {
  return lstatSync(path.join(basePath, name)).isDirectory();
});

module.exports = {
  roots: ['<rootDir>/src', '<rootDir>/__tests__'],
  transform: {
    '^.+\\.ts$': '@swc/jest',
    '^.+\\.tsx$': [
      '@swc/jest',
      {
        jsc: {
          transform: {
            react: {
              runtime: 'automatic',
            },
          },
        },
      },
    ],
  },
  testRegex: '(/__tests__/.*.(test|spec)).(jsx?|tsx?)$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  collectCoverage: false,
  coveragePathIgnorePatterns: ['(tests/.*.mock).(jsx?|tsx?)$'],
  verbose: true,
  testTimeout: 30000,

  moduleNameMapper: {
    '^.+\\.(css|less)$': '<rootDir>/../../jest.css.js',
    ...packages.reduce(
      (acc, name) => ({
        ...acc,
        [`@atomic-testing/${name}/(.*)$`]: `<rootDir>/packages/../../${name}/src/$1`,
      }),
      {}
    ),
  },
  globals: {
    IS_REACT_ACT_ENVIRONMENT: true,
  },
};
