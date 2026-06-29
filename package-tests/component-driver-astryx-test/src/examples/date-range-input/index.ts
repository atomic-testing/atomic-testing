import { IExampleUnit, ScenePart } from '@atomic-testing/core';
import { JSX } from 'react';

import { dateRangeInputExample, dateRangeInputExampleTestSuite } from './DateRangeInput.suite';

export { dateRangeInputUIExample } from './DateRangeInput.examples';
export { dateRangeInputExample, dateRangeInputExampleTestSuite };

export const dateRangeInputExamples = [dateRangeInputExample] satisfies IExampleUnit<ScenePart, JSX.Element>[];
