import { JSX } from 'react';

import { IExampleUnit, ScenePart } from '@atomic-testing/core';

import { checkboxGroupExample as checkboxGroupWithScene } from './CheckboxGroup.suite';
import { singleCheckboxExample as singleCheckboxWithScene } from './SingleCheckbox.suite';

export { checkboxGroupTestSuite } from './CheckboxGroup.suite';
export { singleCheckboxTestSuite } from './SingleCheckbox.suite';

export const singleCheckboxExample = singleCheckboxWithScene;
export const checkboxGroupExample = checkboxGroupWithScene;

export const checkboxExamples = [singleCheckboxExample, checkboxGroupExample] satisfies IExampleUnit<
  ScenePart,
  JSX.Element
>[];
