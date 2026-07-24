import { testRunner } from '@atomic-testing/internal-test-runner';
import { jestTestAdapter } from '@atomic-testing/internal-test-runner-jest-adapter';
import { createTestEngine } from '@atomic-testing/vue-3';

import { TooltipExample } from '../src/examples/tooltip/Tooltip.examples';
import { tooltipTestSuite } from '../src/examples/tooltip/Tooltip.suite';

testRunner(tooltipTestSuite, jestTestAdapter, {
  getTestEngine: scenePart => createTestEngine(TooltipExample, scenePart),
});
