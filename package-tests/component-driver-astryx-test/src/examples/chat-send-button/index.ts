import { IExampleUnit, ScenePart } from '@atomic-testing/core';
import { JSX } from 'react';

import { chatSendButtonExample, chatSendButtonExampleTestSuite } from './ChatSendButton.suite';

export { chatSendButtonUIExample } from './ChatSendButton.examples';
export { chatSendButtonExample, chatSendButtonExampleTestSuite };

export const chatSendButtonExamples = [chatSendButtonExample] satisfies IExampleUnit<ScenePart, JSX.Element>[];
