import { IExampleUnit, ScenePart } from '@atomic-testing/core';
import { JSX } from 'react';

import { textareaExample, textareaExampleTestSuite } from './Textarea.suite';

export { textareaUIExample } from './Textarea.examples';
export { textareaExample, textareaExampleTestSuite };

export const textareaExamples = [textareaExample] satisfies IExampleUnit<ScenePart, JSX.Element>[];
