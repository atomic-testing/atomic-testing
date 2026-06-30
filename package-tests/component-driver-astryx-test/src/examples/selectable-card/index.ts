import { ScenePart } from '@atomic-testing/core';
import { IExampleUnit } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { selectableCardExample, selectableCardExampleTestSuite } from './SelectableCard.suite';

export { selectableCardUIExample } from './SelectableCard.examples';
export { selectableCardExample, selectableCardExampleTestSuite };

export const selectableCardExamples = [selectableCardExample] satisfies IExampleUnit<ScenePart, JSX.Element>[];
