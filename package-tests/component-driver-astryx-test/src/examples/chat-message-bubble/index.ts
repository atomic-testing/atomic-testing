import { IExampleUnit, ScenePart } from '@atomic-testing/core';
import { JSX } from 'react';

import { chatMessageBubbleExample, chatMessageBubbleExampleTestSuite } from './ChatMessageBubble.suite';

export { chatMessageBubbleUIExample } from './ChatMessageBubble.examples';
export { chatMessageBubbleExample, chatMessageBubbleExampleTestSuite };

export const chatMessageBubbleExamples = [chatMessageBubbleExample] satisfies IExampleUnit<ScenePart, JSX.Element>[];
