import { IExampleUnit, ScenePart } from '@atomic-testing/core';
import { JSX } from 'react';

import { buttonGroupExample, buttonGroupExampleTestSuite } from './ButtonGroup.suite';

export { buttonGroupUIExample } from './ButtonGroup.examples';
export { buttonGroupExample, buttonGroupExampleTestSuite };

export const buttonGroupExamples = [buttonGroupExample] satisfies IExampleUnit<ScenePart, JSX.Element>[];
