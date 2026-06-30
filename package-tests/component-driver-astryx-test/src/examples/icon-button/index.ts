import { ScenePart } from '@atomic-testing/core';
import { IExampleUnit } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { iconButtonExample, iconButtonExampleTestSuite } from './IconButton.suite';

export { iconButtonUIExample } from './IconButton.examples';
export { iconButtonExample, iconButtonExampleTestSuite };

export const iconButtonExamples = [iconButtonExample] satisfies IExampleUnit<ScenePart, JSX.Element>[];
