import { IExampleUnit, ScenePart } from '@atomic-testing/core';
import { JSX } from 'react';

import { chatToolCallsExample, chatToolCallsExampleTestSuite } from './ChatToolCalls.suite';

export { chatToolCallsUIExample } from './ChatToolCalls.examples';
export { chatToolCallsExample, chatToolCallsExampleTestSuite };

export const chatToolCallsExamples = [chatToolCallsExample] satisfies IExampleUnit<ScenePart, JSX.Element>[];
