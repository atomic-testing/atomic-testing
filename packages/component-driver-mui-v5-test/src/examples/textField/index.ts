import { IExampleUnit, ScenePart } from '@atomic-testing/core';
import { basicTextFieldExample as basicTextField } from './BasicTextField.examples';
import { multilineTextFieldExample as multilineTextField } from './MultilineTextField.examples';
import { readonlyAndDisabledTextFieldExample as readonlyAndDisabledTextField } from './ReadonlyDisabledTextField.examples';
import { selectTextFieldExample as selectTextField } from './SelectTextField.examples';
export { basicTextFieldTestSuite } from './BasicTextField.examples';
export { multilineTextFieldTestSuite } from './MultilineTextField.examples';
export { readonlyAndDisabledTextFieldTestSuite } from './ReadonlyDisabledTextField.examples';
export { selectTextFieldTestSuite } from './SelectTextField.examples';

export const basicTextFieldExample = basicTextField;
export const multilineTextFieldExample = multilineTextField;
export const readonlyAndDisabledTextFieldExample = readonlyAndDisabledTextField;
export const selectTextFieldExample = selectTextField;

export const textFieldExamples = [
  basicTextFieldExample,
  multilineTextFieldExample,
  selectTextFieldExample,
  readonlyAndDisabledTextFieldExample,
] satisfies IExampleUnit<ScenePart, JSX.Element>[];
