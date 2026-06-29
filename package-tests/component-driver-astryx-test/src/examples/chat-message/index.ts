import { IExampleUnit, ScenePart } from '@atomic-testing/core';
import { JSX } from 'react';

import { chatMessageExample, chatMessageExampleTestSuite } from './ChatMessage.suite';

export { chatMessageUIExample } from './ChatMessage.examples';
export { chatMessageExample, chatMessageExampleTestSuite };

export const chatMessageExamples = [chatMessageExample] satisfies IExampleUnit<ScenePart, JSX.Element>[];
