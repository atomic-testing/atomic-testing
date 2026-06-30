import { ScenePart } from '@atomic-testing/core';
import { IExampleUnit } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { focusEventExample, focusEventExampleTestSuite } from './Focus.suite';

export { focusEventExample, focusEventExampleTestSuite };

export const focusEventExamples = [focusEventExample] satisfies IExampleUnit<ScenePart, JSX.Element>[];
