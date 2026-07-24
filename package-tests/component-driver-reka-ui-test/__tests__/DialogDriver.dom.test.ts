import { testRunner } from '@atomic-testing/internal-test-runner';
import { jestTestAdapter } from '@atomic-testing/internal-test-runner-jest-adapter';
import { createTestEngine } from '@atomic-testing/vue-3';

import { DialogExample } from '../src/examples/dialog/Dialog.examples';
import { dialogTestSuite } from '../src/examples/dialog/Dialog.suite';

testRunner(dialogTestSuite, jestTestAdapter, {
  getTestEngine: scenePart => createTestEngine(DialogExample, scenePart),
});
