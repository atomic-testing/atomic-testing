import { IExampleUnit, ScenePart } from '@atomic-testing/core';
import { JSX } from 'react';

import { chatSystemMessageExample, chatSystemMessageExampleTestSuite } from './ChatSystemMessage.suite';

export { chatSystemMessageUIExample } from './ChatSystemMessage.examples';
export { chatSystemMessageExample, chatSystemMessageExampleTestSuite };

export const chatSystemMessageExamples = [chatSystemMessageExample] satisfies IExampleUnit<ScenePart, JSX.Element>[];
