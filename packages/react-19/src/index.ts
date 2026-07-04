// Thin re-export: the implementation lives in @atomic-testing/react-core.
// This package exists solely to pin the React 19 peerDependency range (ADR-003).
export { createRenderedTestEngine, createTestEngine } from '@atomic-testing/react-core';
export type { IReactTestEngineOption } from '@atomic-testing/react-core';
