import { IExampleUnit, ScenePart } from '@atomic-testing/core';
import { JSX } from 'react';

import { chatComposerInputExample, chatComposerInputExampleTestSuite } from './ChatComposerInput.suite';

export { chatComposerInputUIExample } from './ChatComposerInput.examples';
export { chatComposerInputExample, chatComposerInputExampleTestSuite };

export const chatComposerInputExamples = [chatComposerInputExample] satisfies IExampleUnit<ScenePart, JSX.Element>[];
