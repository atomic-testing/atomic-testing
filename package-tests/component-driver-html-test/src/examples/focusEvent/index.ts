import { IExampleUnit, ScenePart } from '@atomic-testing/core';
import { JSX } from 'react';

import { focusEventExample, focusEventExampleTestSuite } from './Focus.suite';

export { focusEventExample, focusEventExampleTestSuite };

export const focusEventExamples = [focusEventExample] satisfies IExampleUnit<ScenePart, JSX.Element>[];
