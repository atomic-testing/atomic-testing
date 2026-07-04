// Thin per-major package: the entire implementation lives in
// @atomic-testing/angular-core; this package exists to pin the matching
// @angular/* peer range (see ADR-013).
export {
  AngularInteractor,
  createRenderedTestEngine,
  createTestEngine,
  defaultSettleTimeoutMs,
} from '@atomic-testing/angular-core';
export type {
  AngularAppStability,
  AngularInteractorOption,
  IAngularRenderedTestEngineOption,
  IAngularTestEngineOption,
} from '@atomic-testing/angular-core';
