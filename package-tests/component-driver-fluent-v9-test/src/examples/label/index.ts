import { IExampleUnit, ScenePart } from '@atomic-testing/core';
import { JSX } from 'react';

import { labelExample, labelExampleTestSuite } from './Label.suite';

export { labelUIExample } from './Label.examples';
export { labelExample, labelExampleTestSuite };

export const labelExamples = [labelExample] satisfies IExampleUnit<ScenePart, JSX.Element>[];
