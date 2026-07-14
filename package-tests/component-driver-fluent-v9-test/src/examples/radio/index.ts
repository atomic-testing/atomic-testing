import { IExampleUnit, ScenePart } from '@atomic-testing/core';
import { JSX } from 'react';

import { radioExample, radioExampleTestSuite } from './Radio.suite';

export { radioUIExample } from './Radio.examples';
export { radioExample, radioExampleTestSuite };

export const radioExamples = [radioExample] satisfies IExampleUnit<ScenePart, JSX.Element>[];
