import { IExampleUnit, ScenePart } from '@atomic-testing/core';
import { JSX } from 'react';

import { textExample, textExampleTestSuite } from './Text.suite';

export { textUIExample } from './Text.examples';
export { textExample, textExampleTestSuite };

export const textExamples = [textExample] satisfies IExampleUnit<ScenePart, JSX.Element>[];
