import { ScenePart } from '@atomic-testing/core';
import { IExampleUnit } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { popoverExample, popoverExampleTestSuite } from './Popover.suite';

export { popoverUIExample } from './Popover.examples';
export { popoverExample, popoverExampleTestSuite };

export const popoverExamples = [popoverExample] satisfies IExampleUnit<ScenePart, JSX.Element>[];
