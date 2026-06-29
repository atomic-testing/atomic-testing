import { IExampleUnit, ScenePart } from '@atomic-testing/core';
import { JSX } from 'react';

import { citationExample, citationExampleTestSuite } from './Citation.suite';

export { citationUIExample } from './Citation.examples';
export { citationExample, citationExampleTestSuite };

export const citationExamples = [citationExample] satisfies IExampleUnit<ScenePart, JSX.Element>[];
