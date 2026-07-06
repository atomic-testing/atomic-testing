/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.tsx?$': ['@swc/jest', { jsc: { transform: { react: { runtime: 'automatic' } } } }],
  },
  // ReactInteractor wraps every interaction in React's act(). Without this flag,
  // React 18+ logs "not wrapped in act(...)" warnings even though it is.
  globals: {
    IS_REACT_ACT_ENVIRONMENT: true,
  },
};
