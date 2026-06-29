import { IExampleUnit, ScenePart } from '@atomic-testing/core';
import { JSX } from 'react';

import { topNavMegaMenuExample, topNavMegaMenuExampleTestSuite } from './TopNavMegaMenu.suite';

export { topNavMegaMenuUIExample } from './TopNavMegaMenu.examples';
export { topNavMegaMenuExample, topNavMegaMenuExampleTestSuite };

export const topNavMegaMenuExamples = [topNavMegaMenuExample] satisfies IExampleUnit<ScenePart, JSX.Element>[];
