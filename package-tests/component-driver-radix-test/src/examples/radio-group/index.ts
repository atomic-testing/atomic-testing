import { IExampleUnit, ScenePart } from '@atomic-testing/core';
import { JSX } from 'react';

import { radioGroupExample, radioGroupExampleTestSuite } from './RadioGroup.suite';

export { radioGroupUIExample } from './RadioGroup.examples';
export { radioGroupExample, radioGroupExampleTestSuite };

export const radioGroupExamples = [radioGroupExample] satisfies IExampleUnit<ScenePart, JSX.Element>[];
