import { IExampleUnit, ScenePart } from '@atomic-testing/core';
import { JSX } from 'react';

import { selectorExample, selectorExampleTestSuite } from './Selector.suite';

export { selectorUIExample } from './Selector.examples';
export { selectorExample, selectorExampleTestSuite };

export const selectorExamples = [selectorExample] satisfies IExampleUnit<ScenePart, JSX.Element>[];
