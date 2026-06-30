import { ScenePart } from '@atomic-testing/core';
import { IExampleUnit } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { buttonExample, buttonExampleTestSuite } from './Button.suite';

export { buttonUIExample } from './Button.examples';
export { buttonExample, buttonExampleTestSuite };

export const buttonExamples = [buttonExample] satisfies IExampleUnit<ScenePart, JSX.Element>[];
