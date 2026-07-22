import { testRunner } from '@atomic-testing/internal-test-runner';
import { jestTestAdapter } from '@atomic-testing/internal-test-runner-jest-adapter';
import { createTestEngine } from '@atomic-testing/vue-3';

import { CheckboxExample } from '../src/examples/checkbox/Checkbox.examples';
import { checkboxTestSuite } from '../src/examples/checkbox/Checkbox.suite';

testRunner(checkboxTestSuite, jestTestAdapter, {
  getTestEngine: scenePart => createTestEngine(CheckboxExample, scenePart),
});
