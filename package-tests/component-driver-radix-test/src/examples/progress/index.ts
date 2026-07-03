import { IExampleUnit, ScenePart } from '@atomic-testing/core';
import { JSX } from 'react';

import { progressExample, progressExampleTestSuite } from './Progress.suite';

export { progressUIExample } from './Progress.examples';
export { progressExample, progressExampleTestSuite };

export const progressExamples = [progressExample] satisfies IExampleUnit<ScenePart, JSX.Element>[];
