import { IExampleUnit, ScenePart } from '@atomic-testing/core';
import { JSX } from 'react';

import { progressBarExample, progressBarExampleTestSuite } from './ProgressBar.suite';

export { progressBarUIExample } from './ProgressBar.examples';
export { progressBarExample, progressBarExampleTestSuite };

export const progressBarExamples = [progressBarExample] satisfies IExampleUnit<ScenePart, JSX.Element>[];
