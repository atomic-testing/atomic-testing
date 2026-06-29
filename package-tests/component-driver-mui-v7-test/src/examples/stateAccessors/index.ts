import { IExampleUnit, ScenePart } from '@atomic-testing/core';
import { JSX } from 'react';

import { stateAccessorsUIExample } from './StateAccessors.example';
import { stateAccessorsExample, stateAccessorsTestSuite } from './StateAccessors.suite';

export { stateAccessorsUIExample, stateAccessorsExample, stateAccessorsTestSuite };

export const stateAccessorsExamples: IExampleUnit<ScenePart, JSX.Element>[] = [
  stateAccessorsExample,
] satisfies IExampleUnit<ScenePart, JSX.Element>[];
