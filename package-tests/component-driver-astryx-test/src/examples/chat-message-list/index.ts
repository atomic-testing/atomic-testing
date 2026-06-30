import { IExampleUnit, ScenePart } from '@atomic-testing/core';
import { JSX } from 'react';

import { chatMessageListExample, chatMessageListExampleTestSuite } from './ChatMessageList.suite';

export { chatMessageListUIExample } from './ChatMessageList.examples';
export { chatMessageListExample, chatMessageListExampleTestSuite };

export const chatMessageListExamples = [chatMessageListExample] satisfies IExampleUnit<ScenePart, JSX.Element>[];
