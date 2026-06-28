import { IExampleUnit, ScenePart } from '@atomic-testing/core';
import { JSX } from 'react';

import { plainListUIExample } from './PlainList.example';
import { plainListExample, plainListTestSuite } from './PlainList.suite';
import { selectableListUIExample } from './SelectableList.example';
import { selectableListExample, selectableListTestSuite } from './SelectableList.suite';

export {
  selectableListUIExample,
  selectableListExample,
  selectableListTestSuite,
  plainListUIExample,
  plainListExample,
  plainListTestSuite,
};

export const listExamples: IExampleUnit<ScenePart, JSX.Element>[] = [
  selectableListExample,
  plainListExample,
] satisfies IExampleUnit<ScenePart, JSX.Element>[];
