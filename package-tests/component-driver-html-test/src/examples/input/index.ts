import { JSX } from 'react';

import { IExampleUnit, ScenePart } from '@atomic-testing/core';

import { controlledTextInputExample, controlledTextInputExampleTestSuite } from './Controlled.suite';
import { uncontrolledTextInputExample, uncontrolledTextInputExampleTestSuite } from './Uncontrolled.suite';

export { controlledTextInputExampleTestSuite, uncontrolledTextInputExampleTestSuite };
export { controlledTextInputExample, uncontrolledTextInputExample };

export const textInputExamples = [uncontrolledTextInputExample, controlledTextInputExample] satisfies IExampleUnit<
  ScenePart,
  JSX.Element
>[];
