import { ScenePart } from '@atomic-testing/core';
import { IExampleUnit } from '@atomic-testing/internal-test-runner';

import { basicDataGridProUIExample } from './BasicDataGridPro.examples';
import { basicDataGridProExample, basicDataGridProTestSuite } from './BasicDataGridPro.suite';

export { basicDataGridProUIExample, basicDataGridProExample, basicDataGridProTestSuite };
export const dataGridProExamples: IExampleUnit<ScenePart, JSX.Element>[] = [
  basicDataGridProExample,
] satisfies IExampleUnit<ScenePart, JSX.Element>[];
