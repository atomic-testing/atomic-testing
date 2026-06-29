import { IExampleUnit, ScenePart } from '@atomic-testing/core';
import { JSX } from 'react';

import { tableExample, tableExampleTestSuite } from './Table.suite';

export { tableUIExample } from './Table.examples';
export { tableExample, tableExampleTestSuite };

export const tableExamples = [tableExample] satisfies IExampleUnit<ScenePart, JSX.Element>[];
