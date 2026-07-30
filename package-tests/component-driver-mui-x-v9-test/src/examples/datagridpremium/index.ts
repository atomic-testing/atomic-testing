import { IExampleUnit, ScenePart } from '@atomic-testing/core';
import { JSX } from 'react';

import { basicDataGridPremiumExample, basicDataGridPremiumTestSuite } from './BasicDataGridPremium.suite';
import { groupedDataGridPremiumExample, groupedDataGridPremiumTestSuite } from './GroupedDataGridPremium.suite';
import {
  interactiveDataGridPremiumExample,
  interactiveDataGridPremiumTestSuite,
} from './InteractiveDataGridPremium.suite';
import {
  masterDetailDataGridPremiumExample,
  masterDetailDataGridPremiumTestSuite,
} from './MasterDetailDataGridPremium.suite';

export { basicDataGridPremiumExample, basicDataGridPremiumTestSuite };
export { interactiveDataGridPremiumExample, interactiveDataGridPremiumTestSuite };
export { groupedDataGridPremiumExample, groupedDataGridPremiumTestSuite };
export { masterDetailDataGridPremiumExample, masterDetailDataGridPremiumTestSuite };
export const dataGridPremiumExamples: IExampleUnit<ScenePart, JSX.Element>[] = [
  basicDataGridPremiumExample,
  interactiveDataGridPremiumExample,
  groupedDataGridPremiumExample,
  masterDetailDataGridPremiumExample,
] satisfies IExampleUnit<ScenePart, JSX.Element>[];
