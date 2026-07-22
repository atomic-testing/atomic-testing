import { testRunner } from '@atomic-testing/internal-test-runner';
import { jestTestAdapter } from '@atomic-testing/internal-test-runner-jest-adapter';
import { createTestEngine } from '@atomic-testing/vue-3';

import { ToggleExample } from '../src/examples/toggle/Toggle.examples';
import { toggleTestSuite } from '../src/examples/toggle/Toggle.suite';

testRunner(toggleTestSuite, jestTestAdapter, {
  getTestEngine: scenePart => createTestEngine(ToggleExample, scenePart),
});
