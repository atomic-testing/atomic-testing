import { testRunner } from '@atomic-testing/internal-test-runner';
import { jestTestAdapter } from '@atomic-testing/internal-test-runner-jest-adapter';
import { createTestEngine } from '@atomic-testing/vue-3';

import { SeparatorExample } from '../src/examples/separator/Separator.examples';
import { separatorTestSuite } from '../src/examples/separator/Separator.suite';

testRunner(separatorTestSuite, jestTestAdapter, {
  getTestEngine: scenePart => createTestEngine(SeparatorExample, scenePart),
});
