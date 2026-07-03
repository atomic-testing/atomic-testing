import { IExampleUnit, ScenePart } from '@atomic-testing/core';
import { JSX } from 'react';

import { checkboxExample, checkboxExampleTestSuite } from './Checkbox.suite';

export { checkboxUIExample } from './Checkbox.examples';
export { checkboxExample, checkboxExampleTestSuite };

export const checkboxExamples = [checkboxExample] satisfies IExampleUnit<ScenePart, JSX.Element>[];
