import { IExampleUnit, ScenePart } from '@atomic-testing/core';
import { JSX } from 'react';

import { menubarExample, menubarExampleTestSuite } from './Menubar.suite';

export { menubarUIExample } from './Menubar.examples';
export { menubarExample, menubarExampleTestSuite };

export const menubarExamples = [menubarExample] satisfies IExampleUnit<ScenePart, JSX.Element>[];
