import { ScenePart } from '@atomic-testing/core';
import { IExampleUnit } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { timeInputExample, timeInputExampleTestSuite } from './TimeInput.suite';

export { timeInputUIExample } from './TimeInput.examples';
export { timeInputExample, timeInputExampleTestSuite };

export const timeInputExamples = [timeInputExample] satisfies IExampleUnit<ScenePart, JSX.Element>[];
