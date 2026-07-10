import { IExampleUnit, ScenePart } from '@atomic-testing/core';
import { JSX } from 'react';

import { dateRangePickerExample, dateRangePickerTestSuite } from './DateRangePicker.suite';
import { dateTimePickerExample, dateTimePickerTestSuite } from './DateTimePicker.suite';
import { desktopDatePickerExample, desktopDatePickerTestSuite } from './DesktopDatePicker.suite';
import { mobileDatePickerExample, mobileDatePickerTestSuite } from './MobileDatePicker.suite';
import { timePickerExample, timePickerTestSuite } from './TimePicker.suite';

export { dateRangePickerExample, dateRangePickerTestSuite };
export { dateTimePickerExample, dateTimePickerTestSuite };
export { desktopDatePickerExample, desktopDatePickerTestSuite };
export { mobileDatePickerExample, mobileDatePickerTestSuite };
export { timePickerExample, timePickerTestSuite };

export const datePickerExamples: IExampleUnit<ScenePart, JSX.Element>[] = [
  desktopDatePickerExample,
  dateTimePickerExample,
  timePickerExample,
  mobileDatePickerExample,
  dateRangePickerExample,
] satisfies IExampleUnit<ScenePart, JSX.Element>[];
