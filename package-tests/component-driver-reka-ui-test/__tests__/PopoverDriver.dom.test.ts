import { testRunner } from '@atomic-testing/internal-test-runner';
import { jestTestAdapter } from '@atomic-testing/internal-test-runner-jest-adapter';
import { createTestEngine } from '@atomic-testing/vue-3';

import { PopoverExample } from '../src/examples/popover/Popover.examples';
import { popoverTestSuite } from '../src/examples/popover/Popover.suite';

testRunner(popoverTestSuite, jestTestAdapter, {
  getTestEngine: scenePart => createTestEngine(PopoverExample, scenePart),
});
