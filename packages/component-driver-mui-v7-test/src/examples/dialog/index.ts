import { IExampleUnit, ScenePart } from '@atomic-testing/core';

import { alertDialogExample, alertDialogTestSuite } from './AlertDialog.examples';
import { slideinDialogExample, slideinDialogTestSuite } from './SlideInDialog.examples';

export { alertDialogTestSuite, slideinDialogExample, alertDialogExample, slideinDialogTestSuite };

export const dialogExamples: IExampleUnit<ScenePart, JSX.Element>[] = [
  alertDialogExample,
  slideinDialogExample,
] satisfies IExampleUnit<ScenePart, JSX.Element>[];
