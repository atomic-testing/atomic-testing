import { IExampleUnit, ScenePart } from '@atomic-testing/core';

import { selectableListExample, selectableListTestSuite } from './SelectableList.example';

export { selectableListExample, selectableListTestSuite };

export const listExamples = [selectableListExample] satisfies IExampleUnit<ScenePart, JSX.Element>[];
