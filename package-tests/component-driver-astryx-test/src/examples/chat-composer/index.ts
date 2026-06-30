import { IExampleUnit, ScenePart } from '@atomic-testing/core';
import { JSX } from 'react';

import { chatComposerExample, chatComposerExampleTestSuite } from './ChatComposer.suite';

export { chatComposerUIExample } from './ChatComposer.examples';
export { chatComposerExample, chatComposerExampleTestSuite };

export const chatComposerExamples = [chatComposerExample] satisfies IExampleUnit<ScenePart, JSX.Element>[];
