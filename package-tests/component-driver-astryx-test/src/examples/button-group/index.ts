import { ScenePart } from '@atomic-testing/core';
import { IExampleUnit } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { buttonGroupExample, buttonGroupExampleTestSuite } from './ButtonGroup.suite';

export { buttonGroupUIExample } from './ButtonGroup.examples';
export { buttonGroupExample, buttonGroupExampleTestSuite };

export const buttonGroupExamples = [buttonGroupExample] satisfies IExampleUnit<ScenePart, JSX.Element>[];
