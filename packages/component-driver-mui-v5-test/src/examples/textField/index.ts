import { IExampleUnit, ScenePart } from '@atomic-testing/core';
import { basicTextFieldExample } from './BasicTextField.examples';
import { dateTextFieldExample } from './DateTextField.examples';
import { multilineTextFieldExample } from './MultilineTextField.examples';
import { readonlyAndDisabledTextFieldExample } from './ReadonlyDisabledTextField.examples';
import { selectTextFieldExample } from './SelectTextField.examples';
export { basicTextFieldTestSuite } from './BasicTextField.examples';
export { dateTextFieldTestSuite } from './DateTextField.examples';
export { multilineTextFieldTestSuite } from './MultilineTextField.examples';
export { readonlyAndDisabledTextFieldTestSuite } from './ReadonlyDisabledTextField.examples';
export { selectTextFieldTestSuite } from './SelectTextField.examples';

export {
  basicTextFieldExample,
  dateTextFieldExample,
  multilineTextFieldExample,
  readonlyAndDisabledTextFieldExample,
  selectTextFieldExample,
};

export const textFieldExamples = [
  basicTextFieldExample,
  dateTextFieldExample,
  multilineTextFieldExample,
  selectTextFieldExample,
  readonlyAndDisabledTextFieldExample,
] satisfies IExampleUnit<ScenePart, JSX.Element>[];
