import { IExampleUnit, ScenePart } from '@atomic-testing/core';
import { JSX } from 'react';

import { navExample, navExampleTestSuite } from './Nav.suite';

export { navUIExample } from './Nav.examples';
export { navExample, navExampleTestSuite };

export const navExamples = [navExample] satisfies IExampleUnit<ScenePart, JSX.Element>[];
