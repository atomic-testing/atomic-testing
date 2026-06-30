import { ScenePart } from '@atomic-testing/core';
import { IExampleUnit } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { controlledTextInputExample, controlledTextInputExampleTestSuite } from './Controlled.suite';
import { uncontrolledTextInputExample, uncontrolledTextInputExampleTestSuite } from './Uncontrolled.suite';

export { controlledTextInputExampleTestSuite, uncontrolledTextInputExampleTestSuite };
export { controlledTextInputExample, uncontrolledTextInputExample };

export const textInputExamples = [uncontrolledTextInputExample, controlledTextInputExample] satisfies IExampleUnit<
  ScenePart,
  JSX.Element
>[];
