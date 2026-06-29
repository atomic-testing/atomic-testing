import { IExampleUnit, ScenePart } from '@atomic-testing/core';
import { JSX } from 'react';

import { codeExample, codeExampleTestSuite } from './Code.suite';

export { codeUIExample } from './Code.examples';
export { codeExample, codeExampleTestSuite };

export const codeExamples = [codeExample] satisfies IExampleUnit<ScenePart, JSX.Element>[];
