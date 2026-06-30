import { IExampleUnit, ScenePart } from '@atomic-testing/core';
import { JSX } from 'react';

import { sideNavExample, sideNavExampleTestSuite } from './SideNav.suite';

export { sideNavUIExample } from './SideNav.examples';
export { sideNavExample, sideNavExampleTestSuite };

export const sideNavExamples = [sideNavExample] satisfies IExampleUnit<ScenePart, JSX.Element>[];
