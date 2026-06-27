import { testRunner } from '@atomic-testing/internal-test-runner';
import { jestTestAdapter } from '@atomic-testing/internal-test-runner-jest-adapter';
import { createTestEngine } from '@atomic-testing/react-18';

import { basicDrawerExample, basicDrawerTestSuite } from '../src/examples';

testRunner(basicDrawerTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof basicDrawerExample.scene) => {
    return createTestEngine(basicDrawerExample.ui, scenePart);
  },
});
