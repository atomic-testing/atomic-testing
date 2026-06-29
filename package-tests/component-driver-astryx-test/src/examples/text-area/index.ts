import { IExampleUnit, ScenePart } from '@atomic-testing/core';
import { JSX } from 'react';

import { textAreaExample, textAreaExampleTestSuite } from './TextArea.suite';

export { textAreaUIExample } from './TextArea.examples';
export { textAreaExample, textAreaExampleTestSuite };

export const textAreaExamples = [textAreaExample] satisfies IExampleUnit<ScenePart, JSX.Element>[];
