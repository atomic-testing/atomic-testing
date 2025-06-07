import { JSX } from 'react';

import { IExampleUnit, ScenePart } from '@atomic-testing/core';

import { iconCheckboxUIExample } from './IconCheckbox.examples';
import { iconCheckboxExample, iconCheckboxTestSuite } from './IconCheckbox.suite';
import { indeterminateCheckboxUIExample } from './IndeterminateCheckbox.examples';
import { indeterminateCheckboxExample, indeterminateCheckboxTestSuite } from './IndeterminateCheckbox.suite';
import { labelCheckboxUIExample } from './LabelCheckbox.examples';
import { labelCheckboxExample, labelCheckboxTestSuite } from './LabelCheckbox.suite';

export {
  iconCheckboxUIExample,
  iconCheckboxExample,
  iconCheckboxTestSuite,
  indeterminateCheckboxUIExample,
  indeterminateCheckboxExample,
  indeterminateCheckboxTestSuite,
  labelCheckboxUIExample,
  labelCheckboxExample,
  labelCheckboxTestSuite,
};

export const checkboxExamples: IExampleUnit<ScenePart, JSX.Element>[] = [
  iconCheckboxExample,
  indeterminateCheckboxExample,
  labelCheckboxExample,
] satisfies IExampleUnit<ScenePart, JSX.Element>[];
