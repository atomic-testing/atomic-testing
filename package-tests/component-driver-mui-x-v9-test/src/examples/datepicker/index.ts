import { ScenePart } from '@atomic-testing/core';
import { IExampleUnit } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { desktopDatePickerExample, desktopDatePickerTestSuite } from './DesktopDatePicker.suite';

export { desktopDatePickerExample, desktopDatePickerTestSuite };
export const datePickerExamples: IExampleUnit<ScenePart, JSX.Element>[] = [
  desktopDatePickerExample,
] satisfies IExampleUnit<ScenePart, JSX.Element>[];
