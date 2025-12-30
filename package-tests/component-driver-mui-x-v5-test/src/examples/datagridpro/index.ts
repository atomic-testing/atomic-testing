import { JSX } from 'react';
import { IExampleUnit, ScenePart } from '@atomic-testing/core';

import { basicDataGridProUIExample } from './BasicDataGridPro.examples';
import { basicDataGridProExample, basicDataGridProTestSuite } from './BasicDataGridPro.suite';

export { basicDataGridProUIExample, basicDataGridProExample, basicDataGridProTestSuite };
export const dataGridProExamples: IExampleUnit<ScenePart, JSX.Element>[] = [
  basicDataGridProExample,
] satisfies IExampleUnit<ScenePart, JSX.Element>[];
