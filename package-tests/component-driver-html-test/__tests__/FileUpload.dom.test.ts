import { testRunner } from '@atomic-testing/internal-test-runner';
import { jestTestAdapter } from '@atomic-testing/internal-test-runner-jest-adapter';
import { createTestEngine } from '@atomic-testing/react-19';

import { fileUploadExample, fileUploadExampleTestSuite } from '../src/examples';

testRunner(fileUploadExampleTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof fileUploadExample.scene) => {
    return createTestEngine(fileUploadExample.ui, scenePart);
  },
});
