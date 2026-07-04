import { IExampleUnit, ScenePart } from '@atomic-testing/core';
import { JSX } from 'react';

import { basicDataGridPremiumExample, basicDataGridPremiumTestSuite } from './BasicDataGridPremium.suite';
import {
  interactiveDataGridPremiumExample,
  interactiveDataGridPremiumTestSuite,
} from './InteractiveDataGridPremium.suite';

export { basicDataGridPremiumExample, basicDataGridPremiumTestSuite };
export { interactiveDataGridPremiumExample, interactiveDataGridPremiumTestSuite };
export const dataGridPremiumExamples: IExampleUnit<ScenePart, JSX.Element>[] = [
  basicDataGridPremiumExample,
  interactiveDataGridPremiumExample,
] satisfies IExampleUnit<ScenePart, JSX.Element>[];
