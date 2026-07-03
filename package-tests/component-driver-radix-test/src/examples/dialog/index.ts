import { IExampleUnit, ScenePart } from '@atomic-testing/core';
import { JSX } from 'react';

import { dialogExample, dialogExampleTestSuite } from './Dialog.suite';

export { dialogUIExample } from './Dialog.examples';
export { dialogExample, dialogExampleTestSuite };

export const dialogExamples = [dialogExample] satisfies IExampleUnit<ScenePart, JSX.Element>[];
