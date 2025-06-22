import { jestTestAdapter } from '@atomic-testing/internal-test-runner-jest-adapter';
import { createTestEngine } from '@atomic-testing/react-18';
import { testRunner } from '@atomic-testing/internal-test-runner';

import { basicAccordionExample, basicAccordionTestSuite } from '../src/examples';

testRunner(basicAccordionTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof basicAccordionExample.scene) => {
    return createTestEngine(basicAccordionExample.ui, scenePart);
  },
});
