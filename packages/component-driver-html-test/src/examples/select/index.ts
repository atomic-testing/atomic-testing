import { IExampleUnit, ScenePart } from '@atomic-testing/core';
import { multipleSelectExample as multipleSelect } from './MultipleSelect.examples';
import { singleSelectExample as singleSelect } from './SingleSelect.examples';
export { multipleSelectTestSuite } from './MultipleSelect.examples';
export { singleSelectTestSuite } from './SingleSelect.examples';

export const multipleSelectExample = multipleSelect;
export const singleSelectExample = singleSelect;

export const selectExamples = [singleSelectExample, multipleSelectExample] satisfies IExampleUnit<
  ScenePart,
  JSX.Element
>[];
