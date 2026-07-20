import { testRunner } from '@atomic-testing/internal-test-runner';
import { jestTestAdapter } from '@atomic-testing/internal-test-runner-jest-adapter';
import { createTestEngine } from '@atomic-testing/react-19';

import { infoLabelExample, infoLabelExampleTestSuite } from '../src/examples';

testRunner(infoLabelExampleTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof infoLabelExample.scene) => {
    return createTestEngine(infoLabelExample.ui, scenePart);
  },
});
