import { ScenePart } from '@atomic-testing/core';
import { IExampleUnit } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { linkExample, linkExampleTestSuite } from './Link.suite';

export { linkUIExample } from './Link.examples';
export { linkExample, linkExampleTestSuite };

export const linkExamples = [linkExample] satisfies IExampleUnit<ScenePart, JSX.Element>[];
