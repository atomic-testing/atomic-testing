import { testRunner } from '@atomic-testing/internal-test-runner';
import { jestTestAdapter } from '@atomic-testing/internal-test-runner-jest-adapter';
import { createTestEngine } from '@atomic-testing/react-19';

import { metadataListExample, metadataListExampleTestSuite } from '../src/examples';

testRunner(metadataListExampleTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof metadataListExample.scene) => {
    return createTestEngine(metadataListExample.ui, scenePart);
  },
});
