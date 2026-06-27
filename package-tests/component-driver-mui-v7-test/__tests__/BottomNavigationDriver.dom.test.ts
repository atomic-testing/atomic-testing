import { testRunner } from '@atomic-testing/internal-test-runner';
import { jestTestAdapter } from '@atomic-testing/internal-test-runner-jest-adapter';
import { createTestEngine } from '@atomic-testing/react-18';

import { basicBottomNavigationExample, basicBottomNavigationTestSuite } from '../src/examples';

testRunner(basicBottomNavigationTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof basicBottomNavigationExample.scene) => {
    return createTestEngine(basicBottomNavigationExample.ui, scenePart);
  },
});
