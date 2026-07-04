import { testRunner } from '@atomic-testing/internal-test-runner';
import { jestTestAdapter } from '@atomic-testing/internal-test-runner-jest-adapter';
import { createTestEngine } from '@atomic-testing/react-19';

import { chartsExample, chartsTestSuite } from '../src/examples';

testRunner(chartsTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof chartsExample.scene) => {
    return createTestEngine(chartsExample.ui, scenePart);
  },
});
