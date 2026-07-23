import { testRunner } from '@atomic-testing/internal-test-runner';
import { jestTestAdapter } from '@atomic-testing/internal-test-runner-jest-adapter';
import { createTestEngine } from '@atomic-testing/react-19';

import { lightboxExample, lightboxExampleTestSuite } from '../src/examples';

testRunner(lightboxExampleTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof lightboxExample.scene) => {
    return createTestEngine(lightboxExample.ui, scenePart);
  },
});
