import { IExampleUnit, ScenePart } from '@atomic-testing/core';
import { JSX } from 'react';

import { navIconExample, navIconExampleTestSuite } from './NavIcon.suite';

export { navIconUIExample } from './NavIcon.examples';
export { navIconExample, navIconExampleTestSuite };

export const navIconExamples = [navIconExample] satisfies IExampleUnit<ScenePart, JSX.Element>[];
