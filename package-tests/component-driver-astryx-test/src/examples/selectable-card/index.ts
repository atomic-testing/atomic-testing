import { IExampleUnit, ScenePart } from '@atomic-testing/core';
import { JSX } from 'react';

import { selectableCardExample, selectableCardExampleTestSuite } from './SelectableCard.suite';

export { selectableCardUIExample } from './SelectableCard.examples';
export { selectableCardExample, selectableCardExampleTestSuite };

export const selectableCardExamples = [selectableCardExample] satisfies IExampleUnit<ScenePart, JSX.Element>[];
