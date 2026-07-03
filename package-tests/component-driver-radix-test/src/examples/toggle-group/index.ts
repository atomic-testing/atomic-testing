import { IExampleUnit, ScenePart } from '@atomic-testing/core';
import { JSX } from 'react';

import { toggleGroupExample, toggleGroupExampleTestSuite } from './ToggleGroup.suite';

export { toggleGroupUIExample } from './ToggleGroup.examples';
export { toggleGroupExample, toggleGroupExampleTestSuite };

export const toggleGroupExamples = [toggleGroupExample] satisfies IExampleUnit<ScenePart, JSX.Element>[];
