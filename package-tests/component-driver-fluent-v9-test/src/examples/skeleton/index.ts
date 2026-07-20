import { IExampleUnit, ScenePart } from '@atomic-testing/core';
import { JSX } from 'react';

import { skeletonExample, skeletonExampleTestSuite } from './Skeleton.suite';

export { skeletonUIExample } from './Skeleton.examples';
export { skeletonExample, skeletonExampleTestSuite };

export const skeletonExamples = [skeletonExample] satisfies IExampleUnit<ScenePart, JSX.Element>[];
