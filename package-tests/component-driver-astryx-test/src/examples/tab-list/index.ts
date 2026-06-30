import { ScenePart } from '@atomic-testing/core';
import { IExampleUnit } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { tabListExample, tabListExampleTestSuite } from './TabList.suite';

export { tabListUIExample } from './TabList.examples';
export { tabListExample, tabListExampleTestSuite };

export const tabListExamples = [tabListExample] satisfies IExampleUnit<ScenePart, JSX.Element>[];
