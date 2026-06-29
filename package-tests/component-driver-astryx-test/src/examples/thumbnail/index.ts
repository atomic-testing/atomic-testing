import { IExampleUnit, ScenePart } from '@atomic-testing/core';
import { JSX } from 'react';

import { thumbnailExample, thumbnailExampleTestSuite } from './Thumbnail.suite';

export { thumbnailUIExample } from './Thumbnail.examples';
export { thumbnailExample, thumbnailExampleTestSuite };

export const thumbnailExamples = [thumbnailExample] satisfies IExampleUnit<ScenePart, JSX.Element>[];
