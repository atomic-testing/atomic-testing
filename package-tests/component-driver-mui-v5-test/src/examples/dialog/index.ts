import { JSX } from 'react';

import { IExampleUnit, ScenePart } from '@atomic-testing/core';

import { alertDialogUIExample } from './AlertDialog.examples';
import { alertDialogExample, alertDialogTestSuite } from './AlertDialog.suite';
import { slideInDialogUIExample } from './SlideInDialog.examples';
import { slideInDialogExample, slideinDialogTestSuite } from './SlideInDialog.suite';

export {
  alertDialogUIExample,
  alertDialogExample,
  alertDialogTestSuite,
  slideInDialogUIExample as slideinDialogUIExample,
  slideInDialogExample as slideinDialogExample,
  slideinDialogTestSuite,
};

export const dialogExamples: IExampleUnit<ScenePart, JSX.Element>[] = [
  alertDialogExample,
  slideInDialogExample,
] satisfies IExampleUnit<ScenePart, JSX.Element>[];
