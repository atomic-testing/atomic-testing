import { IExampleUnit, ScenePart } from '@atomic-testing/core';
import { JSX } from 'react';

import { comboboxExample, comboboxExampleTestSuite } from './Combobox.suite';

export { comboboxUIExample } from './Combobox.examples';
export { comboboxExample, comboboxExampleTestSuite };

export const comboboxExamples = [comboboxExample] satisfies IExampleUnit<ScenePart, JSX.Element>[];
