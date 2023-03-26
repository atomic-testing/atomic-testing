import { IExampleUnit, ScenePart } from '@atomic-testing/core';
import { basicSelectExample as basicSelect } from './BasicSelect.examples';
import { nativeSelectExample as nativeSelect } from './NativeSelect.examples';
export { basicSelectTestSuite } from './BasicSelect.examples';
export { nativeSelectTestSuite } from './NativeSelect.examples';

export const basicSelectExample = basicSelect;
export const nativeSelectExample = nativeSelect;

export const selectExamples = [basicSelectExample, nativeSelectExample] satisfies IExampleUnit<
  ScenePart,
  JSX.Element
>[];
