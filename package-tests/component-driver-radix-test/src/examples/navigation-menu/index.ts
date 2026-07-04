import { IExampleUnit, ScenePart } from '@atomic-testing/core';
import { JSX } from 'react';

import { navigationMenuExample, navigationMenuExampleTestSuite } from './NavigationMenu.suite';

export { navigationMenuUIExample } from './NavigationMenu.examples';
export { navigationMenuExample, navigationMenuExampleTestSuite };

export const navigationMenuExamples = [navigationMenuExample] satisfies IExampleUnit<ScenePart, JSX.Element>[];
