import { IExampleUnit, ScenePart } from '@atomic-testing/core';
import { JSX } from 'react';

import { aspectRatioExample, aspectRatioExampleTestSuite } from './AspectRatio.suite';

export { aspectRatioUIExample } from './AspectRatio.examples';
export { aspectRatioExample, aspectRatioExampleTestSuite };

export const aspectRatioExamples = [aspectRatioExample] satisfies IExampleUnit<ScenePart, JSX.Element>[];
