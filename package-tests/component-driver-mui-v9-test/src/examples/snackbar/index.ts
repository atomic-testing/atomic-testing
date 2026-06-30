import { ScenePart } from '@atomic-testing/core';
import { IExampleUnit, IExampleUIUnit } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

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
