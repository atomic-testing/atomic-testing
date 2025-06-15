import { JSX } from 'react';

import { IExampleUnit, IExampleUIUnit, ScenePart } from '@atomic-testing/core';

import { basicSelectUIExample } from './BasicSelect.examples';
import { basicSelectExample, basicSelectTestSuite } from './BasicSelect.suite';
import { nativeSelectUIExample } from './NativeSelect.examples';
import { nativeSelectExample, nativeSelectTestSuite } from './NativeSelect.suite';

export {
  basicSelectUIExample,
  basicSelectExample,
  basicSelectTestSuite,
  nativeSelectUIExample,
  nativeSelectExample,
  nativeSelectTestSuite,
};

export const selectUIExamples: IExampleUIUnit<JSX.Element>[] = [
  basicSelectUIExample,
  nativeSelectUIExample,
] satisfies IExampleUIUnit<JSX.Element>[];

export const selectExamples: IExampleUnit<ScenePart, JSX.Element>[] = [
  basicSelectExample,
  nativeSelectExample,
] satisfies IExampleUnit<ScenePart, JSX.Element>[];
