import { IExampleUnit, ScenePart } from '@atomic-testing/core';

import { basicRatingExample as basic } from './Rating.examples';

export { ratingTestSuite } from './Rating.examples';

export const basicRatingExample = basic;
export const ratingExamples = [basic] satisfies IExampleUnit<ScenePart, JSX.Element>[];
