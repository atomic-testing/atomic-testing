import { IExampleUnit, ScenePart } from '@atomic-testing/core';
import { basicAlertExample, basicAlertTestSuite } from './BasicAlert.examples';

export { basicAlertExample, basicAlertTestSuite };

export const alertExamples: IExampleUnit<ScenePart, JSX.Element>[] = [basicAlertExample] satisfies IExampleUnit<
  ScenePart,
  JSX.Element
>[];
