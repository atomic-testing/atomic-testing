import { ScenePart } from '@atomic-testing/core';
import { IExampleUnit } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { rangeInputExample, rangeInputExampleTestSuite } from './RangeInput.suite';

export { rangeInputExample, rangeInputExampleTestSuite };

export const rangeInputExamples = [rangeInputExample] satisfies IExampleUnit<ScenePart, JSX.Element>[];
