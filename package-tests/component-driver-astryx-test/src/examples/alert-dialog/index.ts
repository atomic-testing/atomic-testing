import { IExampleUnit, ScenePart } from '@atomic-testing/core';
import { JSX } from 'react';

import { alertDialogExample, alertDialogExampleTestSuite } from './AlertDialog.suite';

export { alertDialogUIExample } from './AlertDialog.examples';
export { alertDialogExample, alertDialogExampleTestSuite };

export const alertDialogExamples = [alertDialogExample] satisfies IExampleUnit<ScenePart, JSX.Element>[];
