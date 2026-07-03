const path = require('path');
const { existsSync, lstatSync, readdirSync, readFileSync } = require('fs');
// get listing of packages in the mono repo
const basePath = path.resolve(__dirname, 'packages');
const packages = readdirSync(basePath).filter(name => {
  const pkgPath = path.join(basePath, name);
  return lstatSync(pkgPath).isDirectory();
});

// Force a single React instance per test package. @atomic-testing/react-core's
// dist imports react-dom/client; without this mapping Node would resolve it
// from packages/react-core/node_modules (its devDependency copy) instead of the
// test package's React, and mixing two React instances breaks rendering.
// Published packages are unaffected: react-core declares react/react-dom as
// peerDependencies, so consumers always resolve to their own single React.
const reactModuleMappings = existsSync(path.join(process.cwd(), 'node_modules', 'react'))
  ? {
      '^react$': '<rootDir>/node_modules/react',
      '^react/(.*)$': '<rootDir>/node_modules/react/$1',
      '^react-dom$': '<rootDir>/node_modules/react-dom',
      '^react-dom/(.*)$': '<rootDir>/node_modules/react-dom/$1',
    }
  : {};

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
        acc[`^${pkgName}$`] = path.join(basePath, name, 'dist/index.cjs');
      } catch {
        // Not a package directory
      }
      return acc;
    }, {}),
    ...reactModuleMappings,
    '^.+\\.(css|less)$': path.resolve(__dirname, 'jest.css.js'),
  },
  globals: {
    IS_REACT_ACT_ENVIRONMENT: true,
  },
};
