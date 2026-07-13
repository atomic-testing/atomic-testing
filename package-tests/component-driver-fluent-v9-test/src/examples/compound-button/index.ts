import { IExampleUnit, ScenePart } from '@atomic-testing/core';
import { JSX } from 'react';

import { compoundButtonExample, compoundButtonExampleTestSuite } from './CompoundButton.suite';

export { compoundButtonUIExample } from './CompoundButton.examples';
export { compoundButtonExample, compoundButtonExampleTestSuite };

export const compoundButtonExamples = [compoundButtonExample] satisfies IExampleUnit<ScenePart, JSX.Element>[];
