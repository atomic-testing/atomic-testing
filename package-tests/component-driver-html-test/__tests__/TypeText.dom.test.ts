import { testRunner } from '@atomic-testing/internal-test-runner';
import { jestTestAdapter } from '@atomic-testing/internal-test-runner-jest-adapter';
import { createTestEngine } from '@atomic-testing/react-19';

import { typeTextExample, typeTextExampleTestSuite } from '../src/examples';

testRunner(typeTextExampleTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof typeTextExample.scene) => {
    return createTestEngine(typeTextExample.ui, scenePart);
  },
});
