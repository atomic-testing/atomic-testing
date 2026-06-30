import { ScenePart } from '@atomic-testing/core';
import { IExampleUnit } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { activateExample, activateExampleTestSuite } from './Activate.suite';

export { activateExample, activateExampleTestSuite };

export const activateExamples = [activateExample] satisfies IExampleUnit<ScenePart, JSX.Element>[];
