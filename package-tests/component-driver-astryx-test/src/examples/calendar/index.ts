import { ScenePart } from '@atomic-testing/core';
import { IExampleUnit } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { calendarExample, calendarExampleTestSuite } from './Calendar.suite';

export { calendarUIExample } from './Calendar.examples';
export { calendarExample, calendarExampleTestSuite };

export const calendarExamples = [calendarExample] satisfies IExampleUnit<ScenePart, JSX.Element>[];
