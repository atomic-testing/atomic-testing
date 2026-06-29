import { IExampleUnit, ScenePart } from '@atomic-testing/core';
import { JSX } from 'react';

import { checkboxInputExample, checkboxInputExampleTestSuite } from './CheckboxInput.suite';

export { checkboxInputUIExample } from './CheckboxInput.examples';
export { checkboxInputExample, checkboxInputExampleTestSuite };

export const checkboxInputExamples = [checkboxInputExample] satisfies IExampleUnit<ScenePart, JSX.Element>[];
