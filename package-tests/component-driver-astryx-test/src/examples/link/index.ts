import { IExampleUnit, ScenePart } from '@atomic-testing/core';
import { JSX } from 'react';

import { linkExample, linkExampleTestSuite } from './Link.suite';

export { linkUIExample } from './Link.examples';
export { linkExample, linkExampleTestSuite };

export const linkExamples = [linkExample] satisfies IExampleUnit<ScenePart, JSX.Element>[];
