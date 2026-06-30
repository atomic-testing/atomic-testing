import { ScenePart } from '@atomic-testing/core';
import { IExampleUnit } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { listExample, listExampleTestSuite } from './List.suite';

export { listUIExample } from './List.examples';
export { listExample, listExampleTestSuite };

export const listExamples = [listExample] satisfies IExampleUnit<ScenePart, JSX.Element>[];
