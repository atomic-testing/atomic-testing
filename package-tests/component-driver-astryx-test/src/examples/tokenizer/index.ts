import { ScenePart } from '@atomic-testing/core';
import { IExampleUnit } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { tokenizerExample, tokenizerExampleTestSuite } from './Tokenizer.suite';

export { tokenizerUIExample } from './Tokenizer.examples';
export { tokenizerExample, tokenizerExampleTestSuite };

export const tokenizerExamples = [tokenizerExample] satisfies IExampleUnit<ScenePart, JSX.Element>[];
