import { IExampleUnit, ScenePart } from '@atomic-testing/core';
import { JSX } from 'react';

import { messageBarExample, messageBarExampleTestSuite } from './MessageBar.suite';

export { messageBarUIExample } from './MessageBar.examples';
export { messageBarExample, messageBarExampleTestSuite };

export const messageBarExamples = [messageBarExample] satisfies IExampleUnit<ScenePart, JSX.Element>[];
