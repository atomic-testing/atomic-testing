import { ScenePart } from '@atomic-testing/core';
import { IExampleUnit } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { textInputExample, textInputExampleTestSuite } from './TextInput.suite';

export { textInputUIExample } from './TextInput.examples';
export { textInputExample, textInputExampleTestSuite };

export const textInputExamples = [textInputExample] satisfies IExampleUnit<ScenePart, JSX.Element>[];
