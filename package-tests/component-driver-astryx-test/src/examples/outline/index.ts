import { ScenePart } from '@atomic-testing/core';
import { IExampleUnit } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { outlineExample, outlineExampleTestSuite } from './Outline.suite';

export { outlineUIExample } from './Outline.examples';
export { outlineExample, outlineExampleTestSuite };

export const outlineExamples = [outlineExample] satisfies IExampleUnit<ScenePart, JSX.Element>[];
