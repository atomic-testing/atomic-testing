import { IExampleUnit, ScenePart } from '@atomic-testing/core';
import { JSX } from 'react';

import { inputExample, inputExampleTestSuite } from './Input.suite';

export { inputUIExample } from './Input.examples';
export { inputExample, inputExampleTestSuite };

export const inputExamples = [inputExample] satisfies IExampleUnit<ScenePart, JSX.Element>[];
