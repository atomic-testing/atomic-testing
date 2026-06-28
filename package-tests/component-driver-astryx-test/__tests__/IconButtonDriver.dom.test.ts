import { testRunner } from '@atomic-testing/internal-test-runner';
import { jestTestAdapter } from '@atomic-testing/internal-test-runner-jest-adapter';
import { createTestEngine } from '@atomic-testing/react-19';

import { iconButtonExample, iconButtonExampleTestSuite } from '../src/examples';

testRunner(iconButtonExampleTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof iconButtonExample.scene) => {
    return createTestEngine(iconButtonExample.ui, scenePart);
  },
});
