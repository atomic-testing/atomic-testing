import { IExampleUnit, ScenePart } from '@atomic-testing/core';
import { JSX } from 'react';

import { collapsibleExample, collapsibleExampleTestSuite } from './Collapsible.suite';

export { collapsibleUIExample } from './Collapsible.examples';
export { collapsibleExample, collapsibleExampleTestSuite };

export const collapsibleExamples = [collapsibleExample] satisfies IExampleUnit<ScenePart, JSX.Element>[];
