import { testRunner } from '@atomic-testing/internal-test-runner';
import { jestTestAdapter } from '@atomic-testing/internal-test-runner-jest-adapter';
import { createTestEngine } from '@atomic-testing/react-19';

import { breadcrumbsExample, breadcrumbsExampleTestSuite } from '../src/examples';

testRunner(breadcrumbsExampleTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof breadcrumbsExample.scene) => {
    return createTestEngine(breadcrumbsExample.ui, scenePart);
  },
});
