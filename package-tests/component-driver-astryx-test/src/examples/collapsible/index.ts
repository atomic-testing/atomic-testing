import { ScenePart } from '@atomic-testing/core';
import { IExampleUnit } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { collapsibleExample, collapsibleExampleTestSuite } from './Collapsible.suite';

export { collapsibleUIExample } from './Collapsible.examples';
export { collapsibleExample, collapsibleExampleTestSuite };

export const collapsibleExamples = [collapsibleExample] satisfies IExampleUnit<ScenePart, JSX.Element>[];
