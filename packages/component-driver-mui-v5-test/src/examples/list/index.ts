import { JSX } from 'react';

import { IExampleUnit, ScenePart } from '@atomic-testing/core';

import { selectableListUIExample } from './SelectableList.example';
import { selectableListExample, selectableListTestSuite } from './SelectableList.suite';

export { selectableListUIExample, selectableListExample, selectableListTestSuite };

export const listExamples: IExampleUnit<ScenePart, JSX.Element>[] = [selectableListExample] satisfies IExampleUnit<
  ScenePart,
  JSX.Element
>[];
