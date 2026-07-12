// Standalone Jest config — deliberately NOT extending jest.config.base.js.
//
// The base config remaps every `@atomic-testing/*` import to that package's
// built `dist`, which exists so the monorepo can test its packages against each
// other. This CLI never imports `@atomic-testing/*` at runtime (it only *reads*
// their package.json manifests as data), so the remap would be dead weight and
// would falsely couple this package's tests to sibling builds. A plain node
// environment with the SWC transform is all the pure-logic unit tests need.
module.exports = {
  roots: ['<rootDir>/src', '<rootDir>/__tests__'],
  testEnvironment: 'node',
  transform: {
    '^.+\\.ts$': '@swc/jest',
  },
  testRegex: '(/__tests__/.*\\.(test|spec))\\.(jsx?|tsx?)$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  verbose: true,
  testTimeout: 30000,
};
