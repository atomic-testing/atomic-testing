import { IExampleUnit, ScenePart } from '@atomic-testing/core';
import { JSX } from 'react';

import { toolbarExample, toolbarExampleTestSuite } from './Toolbar.suite';

export { toolbarUIExample } from './Toolbar.examples';
export { toolbarExample, toolbarExampleTestSuite };

export const toolbarExamples = [toolbarExample] satisfies IExampleUnit<ScenePart, JSX.Element>[];
