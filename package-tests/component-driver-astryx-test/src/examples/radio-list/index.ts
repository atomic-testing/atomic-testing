import { ScenePart } from '@atomic-testing/core';
import { IExampleUnit } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { radioListExample, radioListExampleTestSuite } from './RadioList.suite';

export { radioListUIExample } from './RadioList.examples';
export { radioListExample, radioListExampleTestSuite };

export const radioListExamples = [radioListExample] satisfies IExampleUnit<ScenePart, JSX.Element>[];
