import { IExampleUnit, ScenePart } from '@atomic-testing/core';
import { JSX } from 'react';

import { outlineExample, outlineExampleTestSuite } from './Outline.suite';

export { outlineUIExample } from './Outline.examples';
export { outlineExample, outlineExampleTestSuite };

export const outlineExamples = [outlineExample] satisfies IExampleUnit<ScenePart, JSX.Element>[];
