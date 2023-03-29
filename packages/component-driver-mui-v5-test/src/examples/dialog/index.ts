import { IExampleUnit, ScenePart } from '@atomic-testing/core';
import { alertDialogExample as alertDialog } from './AlertDialog.examples';

export const alertDialogExample = alertDialog;

export const dialogExamples: IExampleUnit<ScenePart, JSX.Element>[] = [alertDialogExample] satisfies IExampleUnit<
  ScenePart,
  JSX.Element
>[];
