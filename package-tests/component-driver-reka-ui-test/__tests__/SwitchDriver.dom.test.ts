import { testRunner } from '@atomic-testing/internal-test-runner';
import { jestTestAdapter } from '@atomic-testing/internal-test-runner-jest-adapter';
import { createTestEngine } from '@atomic-testing/vue-3';

import { SwitchExample } from '../src/examples/switch/Switch.examples';
import { switchTestSuite } from '../src/examples/switch/Switch.suite';

testRunner(switchTestSuite, jestTestAdapter, {
  getTestEngine: scenePart => createTestEngine(SwitchExample, scenePart),
});
