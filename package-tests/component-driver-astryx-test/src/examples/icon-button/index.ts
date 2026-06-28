import { IExampleUnit, ScenePart } from '@atomic-testing/core';
import { JSX } from 'react';

import { iconButtonExample, iconButtonExampleTestSuite } from './IconButton.suite';

export { iconButtonUIExample } from './IconButton.examples';
export { iconButtonExample, iconButtonExampleTestSuite };

export const iconButtonExamples = [iconButtonExample] satisfies IExampleUnit<ScenePart, JSX.Element>[];
