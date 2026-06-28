import { IExampleUnit, ScenePart } from '@atomic-testing/core';
import { JSX } from 'react';

import { buttonExample, buttonExampleTestSuite } from './Button.suite';

export { buttonUIExample } from './Button.examples';
export { buttonExample, buttonExampleTestSuite };

export const buttonExamples = [buttonExample] satisfies IExampleUnit<ScenePart, JSX.Element>[];
