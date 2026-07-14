import { testRunner } from '@atomic-testing/internal-test-runner';
import { jestTestAdapter } from '@atomic-testing/internal-test-runner-jest-adapter';
import { createTestEngine } from '@atomic-testing/react-19';

import { imageExample, imageExampleTestSuite } from '../src/examples';

testRunner(imageExampleTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof imageExample.scene) => {
    return createTestEngine(imageExample.ui, scenePart);
  },
});
