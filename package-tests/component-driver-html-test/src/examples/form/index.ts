import { ScenePart } from '@atomic-testing/core';
import { IExampleUnit } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { linkedElementExample, linkedElementTestSuite } from './LinkedElement.suite';

export { linkedElementExample, linkedElementTestSuite };

export const formExamples = [linkedElementExample] satisfies IExampleUnit<ScenePart, JSX.Element>[];
