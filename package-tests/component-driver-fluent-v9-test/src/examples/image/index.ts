import { IExampleUnit, ScenePart } from '@atomic-testing/core';
import { JSX } from 'react';

import { imageExample, imageExampleTestSuite } from './Image.suite';

export { imageUIExample } from './Image.examples';
export { imageExample, imageExampleTestSuite };

export const imageExamples = [imageExample] satisfies IExampleUnit<ScenePart, JSX.Element>[];
