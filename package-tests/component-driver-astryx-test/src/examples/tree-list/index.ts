import { ScenePart } from '@atomic-testing/core';
import { IExampleUnit } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { treeListExample, treeListExampleTestSuite } from './TreeList.suite';

export { treeListUIExample } from './TreeList.examples';
export { treeListExample, treeListExampleTestSuite };

export const treeListExamples = [treeListExample] satisfies IExampleUnit<ScenePart, JSX.Element>[];
