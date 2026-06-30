import { IExampleUnit, ScenePart } from '@atomic-testing/core';
import { JSX } from 'react';

import { timestampExample, timestampExampleTestSuite } from './Timestamp.suite';

export { timestampUIExample } from './Timestamp.examples';
export { timestampExample, timestampExampleTestSuite };

export const timestampExamples = [timestampExample] satisfies IExampleUnit<ScenePart, JSX.Element>[];
