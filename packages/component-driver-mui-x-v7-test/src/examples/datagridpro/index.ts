import { JSX } from 'react';

import { IExampleUnit, ScenePart } from '@atomic-testing/core';

import { basicDataGridProExample, basicDataGridProTestSuite } from './BasicDataGridPro.suite';

export { basicDataGridProExample, basicDataGridProTestSuite };
export const dataGridProExamples: IExampleUnit<ScenePart, JSX.Element>[] = [
  basicDataGridProExample,
] satisfies IExampleUnit<ScenePart, JSX.Element>[];
