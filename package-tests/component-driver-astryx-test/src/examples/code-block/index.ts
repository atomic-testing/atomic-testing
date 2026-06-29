import { IExampleUnit, ScenePart } from '@atomic-testing/core';
import { JSX } from 'react';

import { codeBlockExample, codeBlockExampleTestSuite } from './CodeBlock.suite';

export { codeBlockUIExample } from './CodeBlock.examples';
export { codeBlockExample, codeBlockExampleTestSuite };

export const codeBlockExamples = [codeBlockExample] satisfies IExampleUnit<ScenePart, JSX.Element>[];
