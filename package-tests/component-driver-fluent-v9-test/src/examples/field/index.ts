import { IExampleUnit, ScenePart } from '@atomic-testing/core';
import { JSX } from 'react';

import { fieldExample, fieldExampleTestSuite } from './Field.suite';

export { fieldUIExample } from './Field.examples';
export { fieldExample, fieldExampleTestSuite };

export const fieldExamples = [fieldExample] satisfies IExampleUnit<ScenePart, JSX.Element>[];
