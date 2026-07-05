import { testRunner } from '@atomic-testing/internal-test-runner';
import { jestTestAdapter } from '@atomic-testing/internal-test-runner-jest-adapter';

import { createPrimeVueTestEngine } from '../src/createPrimeVueTestEngine';
import { ButtonExample } from '../src/examples/button/Button.examples';
import { buttonTestSuite } from '../src/examples/button/Button.suite';

testRunner(buttonTestSuite, jestTestAdapter, {
  getTestEngine: scenePart => createPrimeVueTestEngine(ButtonExample, scenePart),
});
