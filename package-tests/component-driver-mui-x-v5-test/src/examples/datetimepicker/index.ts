import { JSX } from 'react';
import { IExampleUnit, ScenePart } from '@atomic-testing/core';

import { basicDatePickerUIExample } from './BasicDateTimePicker.examples';
import { basicDatePickerExample, basicDatePickerTestSuite } from './BasicDateTimePicker.suite';
import { basicDateRangePickerUIExample } from './DateRangePicker.examples';
import { basicDateRangePickerExample, basicDateRangePickerTestSuite } from './DateRangePicker.suite';

export { basicDatePickerUIExample, basicDatePickerExample, basicDatePickerTestSuite };
export { basicDateRangePickerUIExample, basicDateRangePickerExample, basicDateRangePickerTestSuite };
export const datePickerExamples: IExampleUnit<ScenePart, JSX.Element>[] = [
  basicDatePickerExample,
  basicDateRangePickerExample,
] satisfies IExampleUnit<ScenePart, JSX.Element>[];
