import { ScenePart } from '@atomic-testing/core';
import { IExampleUnit } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { textAreaExample, textAreaExampleTestSuite } from './TextArea.suite';

export { textAreaUIExample } from './TextArea.examples';
export { textAreaExample, textAreaExampleTestSuite };

export const textAreaExamples = [textAreaExample] satisfies IExampleUnit<ScenePart, JSX.Element>[];
