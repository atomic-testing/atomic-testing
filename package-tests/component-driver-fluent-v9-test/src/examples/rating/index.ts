import { IExampleUnit, ScenePart } from '@atomic-testing/core';
import { JSX } from 'react';

import { ratingExample, ratingExampleTestSuite } from './Rating.suite';

export { ratingUIExample } from './Rating.examples';
export { ratingExample, ratingExampleTestSuite };

export const ratingExamples = [ratingExample] satisfies IExampleUnit<ScenePart, JSX.Element>[];
