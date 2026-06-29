import { IExampleUnit, ScenePart } from '@atomic-testing/core';
import { JSX } from 'react';

import { statusDotExample, statusDotExampleTestSuite } from './StatusDot.suite';

export { statusDotUIExample } from './StatusDot.examples';
export { statusDotExample, statusDotExampleTestSuite };

export const statusDotExamples = [statusDotExample] satisfies IExampleUnit<ScenePart, JSX.Element>[];
