import { IExampleUnit, ScenePart } from '@atomic-testing/core';
import { JSX } from 'react';

import { moreMenuExample, moreMenuExampleTestSuite } from './MoreMenu.suite';

export { moreMenuUIExample } from './MoreMenu.examples';
export { moreMenuExample, moreMenuExampleTestSuite };

export const moreMenuExamples = [moreMenuExample] satisfies IExampleUnit<ScenePart, JSX.Element>[];
