import { testRunner } from '@atomic-testing/internal-test-runner';
import { jestTestAdapter } from '@atomic-testing/internal-test-runner-jest-adapter';
import { createTestEngine } from '@atomic-testing/react-19';

import { fileInputExample, fileInputExampleTestSuite } from '../src/examples';

testRunner(fileInputExampleTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof fileInputExample.scene) => {
    return createTestEngine(fileInputExample.ui, scenePart);
  },
});
