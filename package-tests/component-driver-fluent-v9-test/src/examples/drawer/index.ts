import { IExampleUnit, ScenePart } from '@atomic-testing/core';
import { JSX } from 'react';

import { drawerExample, drawerExampleTestSuite } from './Drawer.suite';

export { drawerUIExample } from './Drawer.examples';
export { drawerExample, drawerExampleTestSuite };

export const drawerExamples = [drawerExample] satisfies IExampleUnit<ScenePart, JSX.Element>[];
