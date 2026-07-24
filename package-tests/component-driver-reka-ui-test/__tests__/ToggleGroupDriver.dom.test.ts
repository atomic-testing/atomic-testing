import { testRunner } from '@atomic-testing/internal-test-runner';
import { jestTestAdapter } from '@atomic-testing/internal-test-runner-jest-adapter';
import { createTestEngine } from '@atomic-testing/vue-3';

import { ToggleGroupExample } from '../src/examples/toggle-group/ToggleGroup.examples';
import { toggleGroupTestSuite } from '../src/examples/toggle-group/ToggleGroup.suite';

testRunner(toggleGroupTestSuite, jestTestAdapter, {
  getTestEngine: scenePart => createTestEngine(ToggleGroupExample, scenePart),
});
