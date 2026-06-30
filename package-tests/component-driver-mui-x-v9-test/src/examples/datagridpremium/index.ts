import { ScenePart } from '@atomic-testing/core';
import { IExampleUnit } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { basicDataGridPremiumExample, basicDataGridPremiumTestSuite } from './BasicDataGridPremium.suite';

export { basicDataGridPremiumExample, basicDataGridPremiumTestSuite };
export const dataGridPremiumExamples: IExampleUnit<ScenePart, JSX.Element>[] = [
  basicDataGridPremiumExample,
] satisfies IExampleUnit<ScenePart, JSX.Element>[];
