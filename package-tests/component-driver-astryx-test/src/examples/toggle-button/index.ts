import { IExampleUnit, ScenePart } from '@atomic-testing/core';
import { JSX } from 'react';

import { toggleButtonExample, toggleButtonExampleTestSuite } from './ToggleButton.suite';

export { toggleButtonUIExample } from './ToggleButton.examples';
export { toggleButtonExample, toggleButtonExampleTestSuite };

export const toggleButtonExamples = [toggleButtonExample] satisfies IExampleUnit<ScenePart, JSX.Element>[];
