import { IExampleUnit, ScenePart } from '@atomic-testing/core';
import { JSX } from 'react';

import { basicTabsUIExample } from './BasicTabs.example';
import { basicTabsExample, basicTabsTestSuite } from './BasicTabs.suite';

export { basicTabsUIExample, basicTabsExample, basicTabsTestSuite };

export const tabsExamples: IExampleUnit<ScenePart, JSX.Element>[] = [basicTabsExample] satisfies IExampleUnit<
  ScenePart,
  JSX.Element
>[];
