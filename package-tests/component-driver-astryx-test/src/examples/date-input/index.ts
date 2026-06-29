import { IExampleUnit, ScenePart } from '@atomic-testing/core';
import { JSX } from 'react';

import { dateInputExample, dateInputExampleTestSuite } from './DateInput.suite';

export { dateInputUIExample } from './DateInput.examples';
export { dateInputExample, dateInputExampleTestSuite };

export const dateInputExamples = [dateInputExample] satisfies IExampleUnit<ScenePart, JSX.Element>[];
