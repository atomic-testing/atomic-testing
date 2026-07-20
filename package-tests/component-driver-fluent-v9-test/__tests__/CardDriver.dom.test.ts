import { testRunner } from '@atomic-testing/internal-test-runner';
import { jestTestAdapter } from '@atomic-testing/internal-test-runner-jest-adapter';
import { createTestEngine } from '@atomic-testing/react-19';

import { cardExample, cardExampleTestSuite } from '../src/examples';

testRunner(cardExampleTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof cardExample.scene) => {
    return createTestEngine(cardExample.ui, scenePart);
  },
});
