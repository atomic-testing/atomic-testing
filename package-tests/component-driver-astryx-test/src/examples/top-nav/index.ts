import { IExampleUnit, ScenePart } from '@atomic-testing/core';
import { JSX } from 'react';

import { topNavExample, topNavExampleTestSuite } from './TopNav.suite';

export { topNavUIExample } from './TopNav.examples';
export { topNavExample, topNavExampleTestSuite };

export const topNavExamples = [topNavExample] satisfies IExampleUnit<ScenePart, JSX.Element>[];
