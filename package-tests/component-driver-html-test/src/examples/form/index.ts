import { JSX } from 'react';

import { IExampleUnit, ScenePart } from '@atomic-testing/core';

import { linkedElementExample, linkedElementTestSuite } from './LinkedElement.suite';

export { linkedElementExample, linkedElementTestSuite };

export const formExamples = [linkedElementExample] satisfies IExampleUnit<ScenePart, JSX.Element>[];
