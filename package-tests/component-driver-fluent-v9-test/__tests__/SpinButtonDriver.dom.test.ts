import { testRunner } from '@atomic-testing/internal-test-runner';
import { jestTestAdapter } from '@atomic-testing/internal-test-runner-jest-adapter';
import { createTestEngine } from '@atomic-testing/react-19';

import { spinButtonExample, spinButtonExampleTestSuite } from '../src/examples';

testRunner(spinButtonExampleTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof spinButtonExample.scene) => {
    return createTestEngine(spinButtonExample.ui, scenePart);
  },
});
