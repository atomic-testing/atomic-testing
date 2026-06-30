import { ScenePart } from '@atomic-testing/core';
import { IExampleUnit } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { keyboardEventExample, keyboardEventExampleTestSuite } from './KeyboardEvent.suite';

export { keyboardEventExample, keyboardEventExampleTestSuite };

export const keyboardEventExamples = [keyboardEventExample] satisfies IExampleUnit<ScenePart, JSX.Element>[];
