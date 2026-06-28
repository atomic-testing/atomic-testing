import { IExampleUnit, ScenePart } from '@atomic-testing/core';
import { JSX } from 'react';

import { textInputExample, textInputExampleTestSuite } from './TextInput.suite';

export { textInputUIExample } from './TextInput.examples';
export { textInputExample, textInputExampleTestSuite };

export const textInputExamples = [textInputExample] satisfies IExampleUnit<ScenePart, JSX.Element>[];
