import { IExampleUnit, ScenePart } from '@atomic-testing/core';
import { JSX } from 'react';

import { activateExample, activateExampleTestSuite } from './Activate.suite';

export { activateExample, activateExampleTestSuite };

export const activateExamples = [activateExample] satisfies IExampleUnit<ScenePart, JSX.Element>[];
