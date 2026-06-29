import { IExampleUnit, ScenePart } from '@atomic-testing/core';
import { JSX } from 'react';

import { spinnerExample, spinnerExampleTestSuite } from './Spinner.suite';

export { spinnerUIExample } from './Spinner.examples';
export { spinnerExample, spinnerExampleTestSuite };

export const spinnerExamples = [spinnerExample] satisfies IExampleUnit<ScenePart, JSX.Element>[];
