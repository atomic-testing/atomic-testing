import { testRunner } from '@atomic-testing/internal-test-runner';
import { jestTestAdapter } from '@atomic-testing/internal-test-runner-jest-adapter';
import { createTestEngine } from '@atomic-testing/vue-3';

import { RadioGroupExample } from '../src/examples/radio-group/RadioGroup.examples';
import { radioGroupTestSuite } from '../src/examples/radio-group/RadioGroup.suite';

testRunner(radioGroupTestSuite, jestTestAdapter, {
  getTestEngine: scenePart => createTestEngine(RadioGroupExample, scenePart),
});
