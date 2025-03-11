import { IExampleUnit, ScenePart } from '@atomic-testing/core';

import { basicDatePickerExample, basicDatePickerTestSuite } from './BasicDateTimePicker.examples';
import { basicDateRangePickerExample, basicDateRangePickerTestSuite } from './DateRangePicker.examples';

export { basicDatePickerExample, basicDatePickerTestSuite };
export { basicDateRangePickerExample, basicDateRangePickerTestSuite };
export const datePickerExamples: IExampleUnit<ScenePart, JSX.Element>[] = [
  basicDatePickerExample,
  basicDateRangePickerExample,
] satisfies IExampleUnit<ScenePart, JSX.Element>[];
