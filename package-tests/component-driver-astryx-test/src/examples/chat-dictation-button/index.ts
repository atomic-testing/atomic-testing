import { IExampleUnit, ScenePart } from '@atomic-testing/core';
import { JSX } from 'react';

import { chatDictationButtonExample, chatDictationButtonExampleTestSuite } from './ChatDictationButton.suite';

export { chatDictationButtonUIExample } from './ChatDictationButton.examples';
export { chatDictationButtonExample, chatDictationButtonExampleTestSuite };

export const chatDictationButtonExamples = [chatDictationButtonExample] satisfies IExampleUnit<
  ScenePart,
  JSX.Element
>[];
