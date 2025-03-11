import { jestTestAdapter } from '@atomic-testing/jest';
import { createTestEngine } from '@atomic-testing/react';
import { testRunner } from '@atomic-testing/test-runner';

import { basicAccordionExample, basicAccordionTestSuite } from '../src/examples';

testRunner(basicAccordionTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof basicAccordionExample.scene) => {
    return createTestEngine(basicAccordionExample.ui, scenePart);
  },
});
