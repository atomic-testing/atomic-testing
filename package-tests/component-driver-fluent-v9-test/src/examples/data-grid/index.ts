import { IExampleUnit, ScenePart } from '@atomic-testing/core';
import { JSX } from 'react';

import { dataGridExample, dataGridExampleTestSuite } from './DataGrid.suite';

export { dataGridUIExample } from './DataGrid.examples';
export { dataGridExample, dataGridExampleTestSuite };

export const dataGridExamples = [dataGridExample] satisfies IExampleUnit<ScenePart, JSX.Element>[];
