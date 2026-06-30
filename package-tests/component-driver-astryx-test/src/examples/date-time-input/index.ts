import { ScenePart } from '@atomic-testing/core';
import { IExampleUnit } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { dateTimeInputExample, dateTimeInputExampleTestSuite } from './DateTimeInput.suite';

export { dateTimeInputUIExample } from './DateTimeInput.examples';
export { dateTimeInputExample, dateTimeInputExampleTestSuite };

export const dateTimeInputExamples = [dateTimeInputExample] satisfies IExampleUnit<ScenePart, JSX.Element>[];
