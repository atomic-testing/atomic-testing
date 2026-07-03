import { IExampleUnit, ScenePart } from '@atomic-testing/core';
import { JSX } from 'react';

import { dropdownMenuExample, dropdownMenuExampleTestSuite } from './DropdownMenu.suite';

export { dropdownMenuUIExample } from './DropdownMenu.examples';
export { dropdownMenuExample, dropdownMenuExampleTestSuite };

export const dropdownMenuExamples = [dropdownMenuExample] satisfies IExampleUnit<ScenePart, JSX.Element>[];
