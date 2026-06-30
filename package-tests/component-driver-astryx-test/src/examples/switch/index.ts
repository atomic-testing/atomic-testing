import { ScenePart } from '@atomic-testing/core';
import { IExampleUnit } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { switchControlExample, switchControlExampleTestSuite } from './Switch.suite';

export { switchControlUIExample } from './Switch.examples';
export { switchControlExample, switchControlExampleTestSuite };

export const switchControlExamples = [switchControlExample] satisfies IExampleUnit<ScenePart, JSX.Element>[];
