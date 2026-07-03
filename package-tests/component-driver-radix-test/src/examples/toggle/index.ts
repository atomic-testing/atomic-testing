import { IExampleUnit, ScenePart } from '@atomic-testing/core';
import { JSX } from 'react';

import { toggleExample, toggleExampleTestSuite } from './Toggle.suite';

export { toggleUIExample } from './Toggle.examples';
export { toggleExample, toggleExampleTestSuite };

export const toggleExamples = [toggleExample] satisfies IExampleUnit<ScenePart, JSX.Element>[];
