import { IExampleUnit, ScenePart } from '@atomic-testing/core';
import { JSX } from 'react';

import { passwordToggleFieldExample, passwordToggleFieldExampleTestSuite } from './PasswordToggleField.suite';

export { passwordToggleFieldUIExample } from './PasswordToggleField.examples';
export { passwordToggleFieldExample, passwordToggleFieldExampleTestSuite };

export const passwordToggleFieldExamples = [passwordToggleFieldExample] satisfies IExampleUnit<
  ScenePart,
  JSX.Element
>[];
