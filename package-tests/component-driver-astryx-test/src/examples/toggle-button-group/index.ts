import { IExampleUnit, ScenePart } from '@atomic-testing/core';
import { JSX } from 'react';

import { toggleButtonGroupExample, toggleButtonGroupExampleTestSuite } from './ToggleButtonGroup.suite';

export { toggleButtonGroupUIExample } from './ToggleButtonGroup.examples';
export { toggleButtonGroupExample, toggleButtonGroupExampleTestSuite };

export const toggleButtonGroupExamples = [toggleButtonGroupExample] satisfies IExampleUnit<ScenePart, JSX.Element>[];
