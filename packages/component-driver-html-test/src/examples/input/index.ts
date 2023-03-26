import { IExampleUnit, ScenePart } from '@atomic-testing/core';
import { controlledTextInputExample as controlledTextInput } from './Controlled.examples';
import { uncontrolledTextInputExample as uncontrolledTextInput } from './Uncontrolled.examples';
export { controlledTextInputExampleTestSuite } from './Controlled.examples';
export { uncontrolledTextInputExampleTestSuite } from './Uncontrolled.examples';

export const uncontrolledTextInputExample = uncontrolledTextInput;
export const controlledTextInputExample = controlledTextInput;

export const textInputExamples = [uncontrolledTextInputExample, controlledTextInputExample] satisfies IExampleUnit<
  ScenePart,
  JSX.Element
>[];
