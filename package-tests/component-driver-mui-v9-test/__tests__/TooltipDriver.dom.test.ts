import { testRunner } from '@atomic-testing/internal-test-runner';
import { jestTestAdapter } from '@atomic-testing/internal-test-runner-jest-adapter';
import { createTestEngine } from '@atomic-testing/react-18';

import { basicTooltipExample, basicTooltipTestSuite } from '../src/examples';

testRunner(basicTooltipTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof basicTooltipExample.scene) => {
    return createTestEngine(basicTooltipExample.ui, scenePart);
  },
});
