import { ScenePart } from '@atomic-testing/core';
import { IExampleUnit } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { basicRatingUIExample } from './Rating.examples';
import { basicRatingExample, basicRatingTestSuite } from './Rating.suite';

export { basicRatingUIExample, basicRatingExample, basicRatingTestSuite };

// For backward compatibility
export { basicRatingTestSuite as ratingTestSuite };

export const ratingExamples: IExampleUnit<ScenePart, JSX.Element>[] = [basicRatingExample] satisfies IExampleUnit<
  ScenePart,
  JSX.Element
>[];
