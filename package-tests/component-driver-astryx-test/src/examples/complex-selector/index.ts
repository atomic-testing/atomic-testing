import { IExampleUnit, ScenePart } from '@atomic-testing/core';
import { JSX } from 'react';

import { complexSelectorExample, complexSelectorExampleTestSuite } from './ComplexSelector.suite';

export { complexSelectorUIExample } from './ComplexSelector.examples';
export { complexSelectorExample, complexSelectorExampleTestSuite };

export const complexSelectorExamples = [complexSelectorExample] satisfies IExampleUnit<ScenePart, JSX.Element>[];
