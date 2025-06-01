import { IExampleUnit, ScenePart } from '@atomic-testing/core';

import { exclusiveSelectionExample } from './ExclusiveSelection.example';
import { regularSelectionExample } from './MultipleSelection.example';
import { singleToggleExample } from './SingleToggle.example';

export { exclusiveSelectionTestSuite } from './ExclusiveSelection.example';
export { regularSelectionButtonTestSuite } from './MultipleSelection.example';
export { singleToggleButtonTestSuite } from './SingleToggle.example';
export { regularSelectionExample, singleToggleExample };

export const toggleButtonExamples = [
  singleToggleExample,
  exclusiveSelectionExample,
  regularSelectionExample,
] satisfies IExampleUnit<ScenePart, JSX.Element>[];
