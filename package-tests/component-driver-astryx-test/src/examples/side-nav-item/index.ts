import { IExampleUnit, ScenePart } from '@atomic-testing/core';
import { JSX } from 'react';

import { sideNavItemExample, sideNavItemExampleTestSuite } from './SideNavItem.suite';

export { sideNavItemUIExample } from './SideNavItem.examples';
export { sideNavItemExample, sideNavItemExampleTestSuite };

export const sideNavItemExamples = [sideNavItemExample] satisfies IExampleUnit<ScenePart, JSX.Element>[];
