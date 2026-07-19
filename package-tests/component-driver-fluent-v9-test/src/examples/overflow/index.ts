import { IExampleUnit, ScenePart } from '@atomic-testing/core';
import { JSX } from 'react';

import { overflowExample, overflowExampleTestSuite } from './Overflow.suite';

export { overflowUIExample } from './Overflow.examples';
export { overflowExample, overflowExampleTestSuite };

export const overflowExamples = [overflowExample] satisfies IExampleUnit<ScenePart, JSX.Element>[];
