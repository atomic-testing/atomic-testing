import { ScenePart } from '@atomic-testing/core';
import { IExampleUnit } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { toggleButtonGroupExample, toggleButtonGroupExampleTestSuite } from './ToggleButtonGroup.suite';

export { toggleButtonGroupUIExample } from './ToggleButtonGroup.examples';
export { toggleButtonGroupExample, toggleButtonGroupExampleTestSuite };

export const toggleButtonGroupExamples = [toggleButtonGroupExample] satisfies IExampleUnit<ScenePart, JSX.Element>[];
