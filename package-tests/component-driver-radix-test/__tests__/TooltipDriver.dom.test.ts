import { testRunner } from '@atomic-testing/internal-test-runner';
import { jestTestAdapter } from '@atomic-testing/internal-test-runner-jest-adapter';
import { createTestEngine } from '@atomic-testing/react-19';

import { tooltipExample, tooltipExampleTestSuite } from '../src/examples';

testRunner(tooltipExampleTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof tooltipExample.scene) => {
    return createTestEngine(tooltipExample.ui, scenePart);
  },
});
