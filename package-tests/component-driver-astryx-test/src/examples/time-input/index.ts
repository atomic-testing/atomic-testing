import { IExampleUnit, ScenePart } from '@atomic-testing/core';
import { JSX } from 'react';

import { timeInputExample, timeInputExampleTestSuite } from './TimeInput.suite';

export { timeInputUIExample } from './TimeInput.examples';
export { timeInputExample, timeInputExampleTestSuite };

export const timeInputExamples = [timeInputExample] satisfies IExampleUnit<ScenePart, JSX.Element>[];
