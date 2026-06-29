import { IExampleUnit, ScenePart } from '@atomic-testing/core';
import { JSX } from 'react';

import { inputGroupExample, inputGroupExampleTestSuite } from './InputGroup.suite';

export { inputGroupUIExample } from './InputGroup.examples';
export { inputGroupExample, inputGroupExampleTestSuite };

export const inputGroupExamples = [inputGroupExample] satisfies IExampleUnit<ScenePart, JSX.Element>[];
