import { IExampleUnit, ScenePart } from '@atomic-testing/core';
import { JSX } from 'react';

import { treeExample, treeExampleTestSuite } from './Tree.suite';

export { treeUIExample } from './Tree.examples';
export { treeExample, treeExampleTestSuite };

export const treeExamples = [treeExample] satisfies IExampleUnit<ScenePart, JSX.Element>[];
