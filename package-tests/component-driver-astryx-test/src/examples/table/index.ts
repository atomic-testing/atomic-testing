import { ScenePart } from '@atomic-testing/core';
import { IExampleUnit } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { tableExample, tableExampleTestSuite } from './Table.suite';

export { tableUIExample } from './Table.examples';
export { tableExample, tableExampleTestSuite };

export const tableExamples = [tableExample] satisfies IExampleUnit<ScenePart, JSX.Element>[];
