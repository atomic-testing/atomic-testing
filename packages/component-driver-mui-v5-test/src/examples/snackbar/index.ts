import { IExampleUnit, ScenePart } from '@atomic-testing/core';
import { basicSnackbarExample, basicSnackbarTestSuite } from './BasicSnackbar.examples';

export { basicSnackbarExample, basicSnackbarTestSuite };

export const snackbarExamples: IExampleUnit<ScenePart, JSX.Element>[] = [basicSnackbarExample] satisfies IExampleUnit<
  ScenePart,
  JSX.Element
>[];
