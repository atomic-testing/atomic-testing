import { ScenePart } from '@atomic-testing/core';
import { IExampleUnit } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { toastExample, toastExampleTestSuite } from './Toast.suite';

export { toastUIExample } from './Toast.examples';
export { toastExample, toastExampleTestSuite };

export const toastExamples = [toastExample] satisfies IExampleUnit<ScenePart, JSX.Element>[];
