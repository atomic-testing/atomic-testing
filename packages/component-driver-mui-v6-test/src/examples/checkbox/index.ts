import { IExampleUnit, ScenePart } from '@atomic-testing/core';

import { iconCheckboxExample as iconCheckbox } from './IconCheckbox.examples';
import { indeterminateCheckboxExample as indeterminateCheckbox } from './IndeterminateCheckbox.examples';
import { labelCheckboxExample as LabelCheckbox } from './LabelCheckbox.examples';

export { iconCheckboxTestSuite } from './IconCheckbox.examples';
export { indeterminateCheckboxTestSuite } from './IndeterminateCheckbox.examples';
export { labelCheckboxTestSuite } from './LabelCheckbox.examples';

export const iconCheckboxExample = iconCheckbox;
export const indeterminateCheckboxExample = indeterminateCheckbox;
export const labelCheckboxExample = LabelCheckbox;

export const checkboxExamples = [
  labelCheckboxExample,
  iconCheckboxExample,
  indeterminateCheckboxExample,
] satisfies IExampleUnit<ScenePart, JSX.Element>[];
