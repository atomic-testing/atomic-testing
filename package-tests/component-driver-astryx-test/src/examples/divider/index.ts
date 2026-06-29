import { IExampleUnit, ScenePart } from '@atomic-testing/core';
import { JSX } from 'react';

import { dividerExample, dividerExampleTestSuite } from './Divider.suite';

export { dividerUIExample } from './Divider.examples';
export { dividerExample, dividerExampleTestSuite };

export const dividerExamples = [dividerExample] satisfies IExampleUnit<ScenePart, JSX.Element>[];
