import { IExampleUnit, ScenePart } from '@atomic-testing/core';
import { JSX } from 'react';

import { treeListExample, treeListExampleTestSuite } from './TreeList.suite';

export { treeListUIExample } from './TreeList.examples';
export { treeListExample, treeListExampleTestSuite };

export const treeListExamples = [treeListExample] satisfies IExampleUnit<ScenePart, JSX.Element>[];
