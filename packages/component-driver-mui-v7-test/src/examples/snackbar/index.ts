import { JSX } from 'react';

import { IExampleUnit, IExampleUIUnit, ScenePart } from '@atomic-testing/core';

import { basicSnackbarUIExample } from './BasicSnackbar.examples';
import { basicSnackbarExample, basicSnackbarTestSuite } from './BasicSnackbar.suite';

export { basicSnackbarUIExample, basicSnackbarExample, basicSnackbarTestSuite };

export const snackbarUIExamples: IExampleUIUnit<JSX.Element>[] = [
  basicSnackbarUIExample,
] satisfies IExampleUIUnit<JSX.Element>[];

export const snackbarExamples: IExampleUnit<ScenePart, JSX.Element>[] = [basicSnackbarExample] satisfies IExampleUnit<
  ScenePart,
  JSX.Element
>[];
