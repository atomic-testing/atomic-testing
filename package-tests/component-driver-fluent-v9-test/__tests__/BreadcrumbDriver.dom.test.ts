import { testRunner } from '@atomic-testing/internal-test-runner';
import { jestTestAdapter } from '@atomic-testing/internal-test-runner-jest-adapter';
import { createTestEngine } from '@atomic-testing/react-19';

import { breadcrumbExample, breadcrumbExampleTestSuite } from '../src/examples';

testRunner(breadcrumbExampleTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof breadcrumbExample.scene) => {
    return createTestEngine(breadcrumbExample.ui, scenePart);
  },
});
