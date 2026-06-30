import { ScenePart } from '@atomic-testing/core';
import { IExampleUnit } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { alertDialogExample, alertDialogExampleTestSuite } from './AlertDialog.suite';

export { alertDialogUIExample } from './AlertDialog.examples';
export { alertDialogExample, alertDialogExampleTestSuite };

export const alertDialogExamples = [alertDialogExample] satisfies IExampleUnit<ScenePart, JSX.Element>[];
