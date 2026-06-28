import { IExampleUnit, ScenePart } from '@atomic-testing/core';
import { JSX } from 'react';

import { keyboardEventExample, keyboardEventExampleTestSuite } from './KeyboardEvent.suite';

export { keyboardEventExample, keyboardEventExampleTestSuite };

export const keyboardEventExamples = [keyboardEventExample] satisfies IExampleUnit<ScenePart, JSX.Element>[];
