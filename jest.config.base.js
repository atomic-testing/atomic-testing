const path = require('path');
const { lstatSync, readdirSync, readFileSync } = require('fs');
// get listing of packages in the mono repo
const basePath = path.resolve(__dirname, 'packages');
const packages = readdirSync(basePath).filter(name => {
  const pkgPath = path.join(basePath, name);
  return lstatSync(pkgPath).isDirectory();
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
    ...packages.reduce((acc, name) => {
      const pkgJsonPath = path.join(basePath, name, 'package.json');
      try {
        const pkgJson = readFileSync(pkgJsonPath, 'utf-8');
        const pkgName = JSON.parse(pkgJson).name;
        acc[`^${pkgName}$`] = path.join(basePath, name, 'dist');
      } catch (e) {
        // Not a package directory
      }
      return acc;
    }, {}),
    '^.+\\.(css|less)$': path.resolve(__dirname, 'jest.css.js'),
  },
  globals: {
    IS_REACT_ACT_ENVIRONMENT: true,
  },
};
