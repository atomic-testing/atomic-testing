import { testRunner } from '@atomic-testing/internal-test-runner';
import { jestTestAdapter } from '@atomic-testing/internal-test-runner-jest-adapter';
import { createTestEngine } from '@atomic-testing/react-18';

import { basicTableExample, basicTableTestSuite } from '../src/examples';

testRunner(basicTableTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof basicTableExample.scene) => {
    return createTestEngine(basicTableExample.ui, scenePart);
  },
});
