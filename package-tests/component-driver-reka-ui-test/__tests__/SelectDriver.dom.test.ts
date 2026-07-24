import { testRunner } from '@atomic-testing/internal-test-runner';
import { jestTestAdapter } from '@atomic-testing/internal-test-runner-jest-adapter';
import { createTestEngine } from '@atomic-testing/vue-3';

import { SelectExample } from '../src/examples/select/Select.examples';
import { selectTestSuite } from '../src/examples/select/Select.suite';

testRunner(selectTestSuite, jestTestAdapter, {
  getTestEngine: scenePart => createTestEngine(SelectExample, scenePart),
});
