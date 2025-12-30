import { JSX } from 'react';

import { IExampleUnit, IExampleUIUnit, ScenePart } from '@atomic-testing/core';

import { basicTextFieldUIExample } from './BasicTextField.examples';
import { basicTextFieldExample, basicTextFieldTestSuite } from './BasicTextField.suite';
import { dateTextFieldUIExample } from './DateTextField.examples';
import { dateTextFieldExample, dateTextFieldTestSuite } from './DateTextField.suite';
import { multilineTextFieldUIExample } from './MultilineTextField.examples';
import { multilineTextFieldExample, multilineTextFieldTestSuite } from './MultilineTextField.suite';
import { numberTextFieldUIExample } from './NumberTextField.examples';
import { numberTextFieldExample, numberTextFieldTestSuite } from './NumberTextField.suite';
import { readonlyAndDisabledTextFieldUIExample } from './ReadonlyDisabledTextField.examples';
import {
  readonlyAndDisabledTextFieldExample,
  readonlyAndDisabledTextFieldTestSuite,
} from './ReadonlyDisabledTextField.suite';
import { selectTextFieldUIExample } from './SelectTextField.examples';
import { selectTextFieldExample, selectTextFieldTestSuite } from './SelectTextField.suite';

export {
  basicTextFieldUIExample,
  basicTextFieldExample,
  basicTextFieldTestSuite,
  dateTextFieldUIExample,
  dateTextFieldExample,
  dateTextFieldTestSuite,
  multilineTextFieldUIExample,
  multilineTextFieldExample,
  multilineTextFieldTestSuite,
  numberTextFieldUIExample,
  numberTextFieldExample,
  numberTextFieldTestSuite,
  readonlyAndDisabledTextFieldUIExample,
  readonlyAndDisabledTextFieldExample,
  readonlyAndDisabledTextFieldTestSuite,
  selectTextFieldUIExample,
  selectTextFieldExample,
  selectTextFieldTestSuite,
};

export const textFieldUIExamples: IExampleUIUnit<JSX.Element>[] = [
  basicTextFieldUIExample,
  numberTextFieldExample,
  dateTextFieldUIExample,
  multilineTextFieldUIExample,
  readonlyAndDisabledTextFieldUIExample,
  selectTextFieldUIExample,
] satisfies IExampleUIUnit<JSX.Element>[];

export const textFieldExamples: IExampleUnit<ScenePart, JSX.Element>[] = [
  basicTextFieldExample,
  numberTextFieldExample,
  dateTextFieldExample,
  multilineTextFieldExample,
  readonlyAndDisabledTextFieldExample,
  selectTextFieldExample,
] satisfies IExampleUnit<ScenePart, JSX.Element>[];
