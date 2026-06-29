// Tells React 18 it is running inside an act()-aware test environment, which the
// atomic-testing ReactInteractor relies on to flush state updates during tests.
(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;
