import { IExampleUnit, ScenePart } from '@atomic-testing/core';
import { JSX } from 'react';

import { multiSelectorExample, multiSelectorExampleTestSuite } from './MultiSelector.suite';

export { multiSelectorUIExample } from './MultiSelector.examples';
export { multiSelectorExample, multiSelectorExampleTestSuite };

export const multiSelectorExamples = [multiSelectorExample] satisfies IExampleUnit<ScenePart, JSX.Element>[];
