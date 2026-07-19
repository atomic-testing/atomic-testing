import { IExampleUnit, ScenePart } from '@atomic-testing/core';
import { JSX } from 'react';

import { dropdownExample, dropdownExampleTestSuite } from './Dropdown.suite';

export { dropdownUIExample } from './Dropdown.examples';
export { dropdownExample, dropdownExampleTestSuite };

export const dropdownExamples = [dropdownExample] satisfies IExampleUnit<ScenePart, JSX.Element>[];
