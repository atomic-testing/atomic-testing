import { IExampleUnit, ScenePart } from '@atomic-testing/core';
import { JSX } from 'react';

import { chatLayoutExample, chatLayoutExampleTestSuite } from './ChatLayout.suite';

export { chatLayoutUIExample } from './ChatLayout.examples';
export { chatLayoutExample, chatLayoutExampleTestSuite };

export const chatLayoutExamples = [chatLayoutExample] satisfies IExampleUnit<ScenePart, JSX.Element>[];
