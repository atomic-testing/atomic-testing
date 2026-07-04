import { IExampleUnit, ScenePart } from '@atomic-testing/core';
import { JSX } from 'react';

import { oneTimePasswordFieldExample, oneTimePasswordFieldExampleTestSuite } from './OneTimePasswordField.suite';

export { oneTimePasswordFieldUIExample } from './OneTimePasswordField.examples';
export { oneTimePasswordFieldExample, oneTimePasswordFieldExampleTestSuite };

export const oneTimePasswordFieldExamples = [oneTimePasswordFieldExample] satisfies IExampleUnit<
  ScenePart,
  JSX.Element
>[];
