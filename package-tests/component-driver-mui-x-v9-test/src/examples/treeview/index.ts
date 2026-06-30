import { ScenePart } from '@atomic-testing/core';
import { IExampleUnit } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { simpleTreeViewExample, simpleTreeViewTestSuite } from './SimpleTreeView.suite';

export { simpleTreeViewExample, simpleTreeViewTestSuite };
export const treeViewExamples: IExampleUnit<ScenePart, JSX.Element>[] = [simpleTreeViewExample] satisfies IExampleUnit<
  ScenePart,
  JSX.Element
>[];
