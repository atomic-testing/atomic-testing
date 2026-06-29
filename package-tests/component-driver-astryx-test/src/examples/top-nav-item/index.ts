import { IExampleUnit, ScenePart } from '@atomic-testing/core';
import { JSX } from 'react';

import { topNavItemExample, topNavItemExampleTestSuite } from './TopNavItem.suite';

export { topNavItemUIExample } from './TopNavItem.examples';
export { topNavItemExample, topNavItemExampleTestSuite };

export const topNavItemExamples = [topNavItemExample] satisfies IExampleUnit<ScenePart, JSX.Element>[];
