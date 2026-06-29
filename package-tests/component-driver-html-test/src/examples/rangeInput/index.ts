import { IExampleUnit, ScenePart } from '@atomic-testing/core';
import { JSX } from 'react';

import { rangeInputExample, rangeInputExampleTestSuite } from './RangeInput.suite';

export { rangeInputExample, rangeInputExampleTestSuite };

export const rangeInputExamples = [rangeInputExample] satisfies IExampleUnit<ScenePart, JSX.Element>[];
