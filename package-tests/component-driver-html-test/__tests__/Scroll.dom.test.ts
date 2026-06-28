import { testRunner } from '@atomic-testing/internal-test-runner';
import { jestTestAdapter } from '@atomic-testing/internal-test-runner-jest-adapter';
import { createTestEngine } from '@atomic-testing/react-19';

import { scrollExample, scrollExampleTestSuite } from '../src/examples';

testRunner(scrollExampleTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof scrollExample.scene) => {
    return createTestEngine(scrollExample.ui, scenePart);
  },
});
