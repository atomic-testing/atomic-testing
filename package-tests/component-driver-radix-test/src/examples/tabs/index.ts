import { IExampleUnit, ScenePart } from '@atomic-testing/core';
import { JSX } from 'react';

import { tabsExample, tabsExampleTestSuite } from './Tabs.suite';

export { tabsUIExample } from './Tabs.examples';
export { tabsExample, tabsExampleTestSuite };

export const tabsExamples = [tabsExample] satisfies IExampleUnit<ScenePart, JSX.Element>[];
