import { IExampleUnit, ScenePart } from '@atomic-testing/core';
import { JSX } from 'react';

import { fieldStatusExample, fieldStatusExampleTestSuite } from './FieldStatus.suite';

export { fieldStatusUIExample } from './FieldStatus.examples';
export { fieldStatusExample, fieldStatusExampleTestSuite };

export const fieldStatusExamples = [fieldStatusExample] satisfies IExampleUnit<ScenePart, JSX.Element>[];
