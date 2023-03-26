import { IExampleUnit, ScenePart } from '@atomic-testing/core';
import { checkboxGroupExample as checkboxGroup } from './CheckboxGroup.examples';
import { singleCheckboxExample as singleCheckbox } from './SingleCheckbox.examples';
export { checkboxGroupTestSuite } from './CheckboxGroup.examples';
export { singleCheckboxTestSuite } from './SingleCheckbox.examples';

export const singleCheckboxExample = singleCheckbox;
export const checkboxGroupExample = checkboxGroup;

export const checkboxExamples = [singleCheckboxExample, checkboxGroupExample] satisfies IExampleUnit<
  ScenePart,
  JSX.Element
>[];
