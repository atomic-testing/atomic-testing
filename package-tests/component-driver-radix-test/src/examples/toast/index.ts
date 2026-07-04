import { IExampleUnit, ScenePart } from '@atomic-testing/core';
import { JSX } from 'react';

import { toastExample, toastExampleTestSuite } from './Toast.suite';

export { toastUIExample } from './Toast.examples';
export { toastExample, toastExampleTestSuite };

export const toastExamples = [toastExample] satisfies IExampleUnit<ScenePart, JSX.Element>[];
