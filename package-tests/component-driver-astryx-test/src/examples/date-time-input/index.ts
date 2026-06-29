import { IExampleUnit, ScenePart } from '@atomic-testing/core';
import { JSX } from 'react';

import { dateTimeInputExample, dateTimeInputExampleTestSuite } from './DateTimeInput.suite';

export { dateTimeInputUIExample } from './DateTimeInput.examples';
export { dateTimeInputExample, dateTimeInputExampleTestSuite };

export const dateTimeInputExamples = [dateTimeInputExample] satisfies IExampleUnit<ScenePart, JSX.Element>[];
