import { ScenePart } from '@atomic-testing/core';
import { IExampleUnit } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { dateRangeInputExample, dateRangeInputExampleTestSuite } from './DateRangeInput.suite';

export { dateRangeInputUIExample } from './DateRangeInput.examples';
export { dateRangeInputExample, dateRangeInputExampleTestSuite };

export const dateRangeInputExamples = [dateRangeInputExample] satisfies IExampleUnit<ScenePart, JSX.Element>[];
