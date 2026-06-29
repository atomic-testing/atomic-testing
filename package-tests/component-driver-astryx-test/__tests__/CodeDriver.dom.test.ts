import { testRunner } from '@atomic-testing/internal-test-runner';
import { jestTestAdapter } from '@atomic-testing/internal-test-runner-jest-adapter';
import { createTestEngine } from '@atomic-testing/react-19';

import { codeExample, codeExampleTestSuite } from '../src/examples';

testRunner(codeExampleTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof codeExample.scene) => {
    return createTestEngine(codeExample.ui, scenePart);
  },
});
