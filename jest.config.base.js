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

// The Vue counterpart of reactModuleMappings, and it is load-bearing for the same
// reason: Vue keeps the active component instance in module-level state, so two
// copies cannot cooperate. pnpm resolves each dependency's `vue` peer against the
// version that dependency's own subtree asked for, and the test packages do not
// agree on a range (reka-ui-test wants `^3.5.40`, vue-3-test `^3.5.39`) — so one
// suite could get `@testing-library/vue` bound to vue@3.5.39 while `reka-ui` was
// bound to vue@3.5.40. The component mounted by one copy is then invisible to the
// other, and the failure surfaces far from its cause: `renderSlot` reading `.ce`
// off a null `currentRenderingInstance`, i.e. "no component is rendering", inside
// a component that demonstrably is.
//
// Aligning the declared ranges would also have collapsed the two copies, but only
// until the next bump of either package — this maps the specifier instead, so the
// invariant holds no matter what the manifests say. Only bare `vue` is mapped:
// `@vue/*` runtime packages are resolved by vue's own subtree, so redirecting them
// to a test package that does not depend on them directly would break resolution.
const vueModuleMappings = existsSync(path.join(process.cwd(), 'node_modules', 'vue'))
  ? {
      '^vue$': '<rootDir>/node_modules/vue',
      '^vue/(.*)$': '<rootDir>/node_modules/vue/$1',
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
    ...vueModuleMappings,
    '^.+\\.(css|less)$': path.resolve(__dirname, 'jest.css.js'),
  },
  globals: {
    IS_REACT_ACT_ENVIRONMENT: true,
  },
};
