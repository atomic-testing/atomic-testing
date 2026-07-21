import { IExampleUnit, ScenePart } from '@atomic-testing/core';
import { JSX } from 'react';

import { flatTreeExample, flatTreeExampleTestSuite } from './FlatTree.suite';

export { flatTreeUIExample } from './FlatTree.examples';
export { flatTreeExample, flatTreeExampleTestSuite };

export const flatTreeExamples = [flatTreeExample] satisfies IExampleUnit<ScenePart, JSX.Element>[];
