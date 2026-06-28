import { testRunner } from '@atomic-testing/internal-test-runner';
import { jestTestAdapter } from '@atomic-testing/internal-test-runner-jest-adapter';
import { createTestEngine } from '@atomic-testing/react-19';

import { inputGroupExample, inputGroupExampleTestSuite } from '../src/examples';

testRunner(inputGroupExampleTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof inputGroupExample.scene) => {
    return createTestEngine(inputGroupExample.ui, scenePart);
  },
});
