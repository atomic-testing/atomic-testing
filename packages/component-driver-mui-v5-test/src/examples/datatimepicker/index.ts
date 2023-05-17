import { IExampleUnit, ScenePart } from '@atomic-testing/core';
import { basicDatePickerExample, basicDatePickerTestSuite } from './BasicDataTimePicker.examples';

export { basicDatePickerExample, basicDatePickerTestSuite };
export const datePickerExamples: IExampleUnit<ScenePart, JSX.Element>[] = [
  basicDatePickerExample,
] satisfies IExampleUnit<ScenePart, JSX.Element>[];
