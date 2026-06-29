import { IExampleUnit, ScenePart } from '@atomic-testing/core';
import { JSX } from 'react';

import { navMenuExample, navMenuExampleTestSuite } from './NavMenu.suite';

export { navMenuUIExample } from './NavMenu.examples';
export { navMenuExample, navMenuExampleTestSuite };

export const navMenuExamples = [navMenuExample] satisfies IExampleUnit<ScenePart, JSX.Element>[];
