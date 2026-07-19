import { IExampleUnit, ScenePart } from '@atomic-testing/core';
import { JSX } from 'react';

import { spinButtonExample, spinButtonExampleTestSuite } from './SpinButton.suite';

export { spinButtonUIExample } from './SpinButton.examples';
export { spinButtonExample, spinButtonExampleTestSuite };

export const spinButtonExamples = [spinButtonExample] satisfies IExampleUnit<ScenePart, JSX.Element>[];
