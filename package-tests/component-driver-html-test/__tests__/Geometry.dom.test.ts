import { testRunner } from '@atomic-testing/internal-test-runner';
import { jestTestAdapter } from '@atomic-testing/internal-test-runner-jest-adapter';
import { createTestEngine } from '@atomic-testing/react-19';

import { geometryExample, geometryExampleTestSuite } from '../src/examples';

testRunner(geometryExampleTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof geometryExample.scene) => {
    return createTestEngine(geometryExample.ui, scenePart);
  },
});
