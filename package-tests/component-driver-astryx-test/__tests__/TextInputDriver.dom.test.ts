import { testRunner } from '@atomic-testing/internal-test-runner';
import { jestTestAdapter } from '@atomic-testing/internal-test-runner-jest-adapter';
import { createTestEngine } from '@atomic-testing/react-19';

import { textInputExample, textInputExampleTestSuite } from '../src/examples';

testRunner(textInputExampleTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof textInputExample.scene) => {
    return createTestEngine(textInputExample.ui, scenePart);
  },
});
