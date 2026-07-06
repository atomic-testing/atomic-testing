import { IExampleUnit, ScenePart } from '@atomic-testing/core';
import { JSX } from 'react';

import { switchExample, switchExampleTestSuite } from './Switch.suite';

export { switchUIExample } from './Switch.examples';
export { switchExample, switchExampleTestSuite };

export const switchExamples = [switchExample] satisfies IExampleUnit<ScenePart, JSX.Element>[];
