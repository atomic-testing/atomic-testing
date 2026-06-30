import { ScenePart } from '@atomic-testing/core';
import { IExampleUnit } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { dropdownMenuExample, dropdownMenuExampleTestSuite } from './DropdownMenu.suite';

export { dropdownMenuUIExample } from './DropdownMenu.examples';
export { dropdownMenuExample, dropdownMenuExampleTestSuite };

export const dropdownMenuExamples = [dropdownMenuExample] satisfies IExampleUnit<ScenePart, JSX.Element>[];
