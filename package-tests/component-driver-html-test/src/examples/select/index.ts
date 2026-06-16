import { IExampleUnit, ScenePart } from '@atomic-testing/core';
import { JSX } from 'react';

import { multipleSelectExample, multipleSelectTestSuite } from './MultipleSelect.suite';
import { singleSelectExample, singleSelectTestSuite } from './SingleSelect.suite';

export { multipleSelectTestSuite, singleSelectTestSuite };
export { multipleSelectExample, singleSelectExample };

export const selectExamples = [singleSelectExample, multipleSelectExample] satisfies IExampleUnit<
  ScenePart,
  JSX.Element
>[];
