import { ScenePart } from '@atomic-testing/core';
import { IExampleUnit } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { toolbarExample, toolbarExampleTestSuite } from './Toolbar.suite';

export { toolbarUIExample } from './Toolbar.examples';
export { toolbarExample, toolbarExampleTestSuite };

export const toolbarExamples = [toolbarExample] satisfies IExampleUnit<ScenePart, JSX.Element>[];
