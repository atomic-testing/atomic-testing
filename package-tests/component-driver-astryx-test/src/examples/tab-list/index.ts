import { IExampleUnit, ScenePart } from '@atomic-testing/core';
import { JSX } from 'react';

import { tabListExample, tabListExampleTestSuite } from './TabList.suite';

export { tabListUIExample } from './TabList.examples';
export { tabListExample, tabListExampleTestSuite };

export const tabListExamples = [tabListExample] satisfies IExampleUnit<ScenePart, JSX.Element>[];
