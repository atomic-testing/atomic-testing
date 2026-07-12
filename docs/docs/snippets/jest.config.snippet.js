/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(t|j)sx?$': ['@swc/jest', { jsc: { transform: { react: { runtime: 'automatic' } } } }],
  },
  testMatch: ['**/*.test.@(ts|tsx|js|jsx)'],
  // ReactInteractor wraps every interaction in React's act(). Without this flag,
  // React 18+ logs "not wrapped in act(...)" warnings even though it is.
  globals: {
    IS_REACT_ACT_ENVIRONMENT: true,
  },
};
