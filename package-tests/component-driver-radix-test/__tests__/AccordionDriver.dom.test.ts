import { testRunner } from '@atomic-testing/internal-test-runner';
import { jestTestAdapter } from '@atomic-testing/internal-test-runner-jest-adapter';
import { createTestEngine } from '@atomic-testing/react-19';

import { accordionExample, accordionExampleTestSuite } from '../src/examples';

testRunner(accordionExampleTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof accordionExample.scene) => {
    return createTestEngine(accordionExample.ui, scenePart);
  },
});
