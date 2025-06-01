import { IExampleUnit, ScenePart } from '@atomic-testing/core';

import { basicProgressExample, progressTestSuite } from './Progress.suite';

export { progressTestSuite, basicProgressExample };

export const progressExamples = [basicProgressExample] satisfies IExampleUnit<ScenePart, JSX.Element>[];
