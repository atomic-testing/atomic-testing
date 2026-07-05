import { testRunner } from '@atomic-testing/internal-test-runner';
import { jestTestAdapter } from '@atomic-testing/internal-test-runner-jest-adapter';

import { createPrimeVueTestEngine } from '../src/createPrimeVueTestEngine';
import { SelectExample } from '../src/examples/select/Select.examples';
import { selectTestSuite } from '../src/examples/select/Select.suite';

testRunner(selectTestSuite, jestTestAdapter, {
  getTestEngine: scenePart => createPrimeVueTestEngine(SelectExample, scenePart),
});
