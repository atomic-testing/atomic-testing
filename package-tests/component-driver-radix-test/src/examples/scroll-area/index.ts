import { IExampleUnit, ScenePart } from '@atomic-testing/core';
import { JSX } from 'react';

import { scrollAreaExample, scrollAreaExampleTestSuite } from './ScrollArea.suite';

export { scrollAreaUIExample } from './ScrollArea.examples';
export { scrollAreaExample, scrollAreaExampleTestSuite };

export const scrollAreaExamples = [scrollAreaExample] satisfies IExampleUnit<ScenePart, JSX.Element>[];
