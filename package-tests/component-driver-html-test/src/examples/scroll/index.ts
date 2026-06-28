import { IExampleUnit, ScenePart } from '@atomic-testing/core';
import { JSX } from 'react';

import { scrollExample, scrollExampleTestSuite } from './Scroll.suite';

export { scrollExample, scrollExampleTestSuite };

export const scrollExamples = [scrollExample] satisfies IExampleUnit<ScenePart, JSX.Element>[];
