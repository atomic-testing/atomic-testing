import { ScenePart } from '@atomic-testing/core';
import { IExampleUnit } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { checkboxListExample, checkboxListExampleTestSuite } from './CheckboxList.suite';

export { checkboxListUIExample } from './CheckboxList.examples';
export { checkboxListExample, checkboxListExampleTestSuite };

export const checkboxListExamples = [checkboxListExample] satisfies IExampleUnit<ScenePart, JSX.Element>[];
