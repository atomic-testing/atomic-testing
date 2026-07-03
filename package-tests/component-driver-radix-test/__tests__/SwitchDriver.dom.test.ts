import { testRunner } from '@atomic-testing/internal-test-runner';
import { jestTestAdapter } from '@atomic-testing/internal-test-runner-jest-adapter';
import { createTestEngine } from '@atomic-testing/react-19';

import { switchExample, switchExampleTestSuite } from '../src/examples';

testRunner(switchExampleTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof switchExample.scene) => {
    return createTestEngine(switchExample.ui, scenePart);
  },
});
