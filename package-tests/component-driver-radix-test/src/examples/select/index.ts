import { IExampleUnit, ScenePart } from '@atomic-testing/core';
import { JSX } from 'react';

import { selectExample, selectExampleTestSuite } from './Select.suite';

export { selectUIExample } from './Select.examples';
export { selectExample, selectExampleTestSuite };

export const selectExamples = [selectExample] satisfies IExampleUnit<ScenePart, JSX.Element>[];
