import { IExampleUnit, ScenePart } from '@atomic-testing/core';
import { JSX } from 'react';

import { topNavMenuExample, topNavMenuExampleTestSuite } from './TopNavMenu.suite';

export { topNavMenuUIExample } from './TopNavMenu.examples';
export { topNavMenuExample, topNavMenuExampleTestSuite };

export const topNavMenuExamples = [topNavMenuExample] satisfies IExampleUnit<ScenePart, JSX.Element>[];
