import { ScenePart } from '@atomic-testing/core';
import { IExampleUnit } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { basicAlertUIExample } from './BasicAlert.examples';
import { basicAlertExample, basicAlertTestSuite } from './BasicAlert.suite';

export { basicAlertUIExample, basicAlertExample, basicAlertTestSuite };

export const alertExamples: IExampleUnit<ScenePart, JSX.Element>[] = [basicAlertExample] satisfies IExampleUnit<
  ScenePart,
  JSX.Element
>[];
