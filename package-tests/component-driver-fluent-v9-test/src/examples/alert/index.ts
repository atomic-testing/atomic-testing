import { IExampleUnit, ScenePart } from '@atomic-testing/core';
import { JSX } from 'react';

import { alertExample, alertExampleTestSuite } from './Alert.suite';

export { alertUIExample } from './Alert.examples';
export { alertExample, alertExampleTestSuite };

export const alertExamples = [alertExample] satisfies IExampleUnit<ScenePart, JSX.Element>[];
