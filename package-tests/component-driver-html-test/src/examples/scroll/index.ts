import { ScenePart } from '@atomic-testing/core';
import { IExampleUnit } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { scrollExample, scrollExampleTestSuite } from './Scroll.suite';

export { scrollExample, scrollExampleTestSuite };

export const scrollExamples = [scrollExample] satisfies IExampleUnit<ScenePart, JSX.Element>[];
