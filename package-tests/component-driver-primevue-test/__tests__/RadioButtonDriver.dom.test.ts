import { testRunner } from '@atomic-testing/internal-test-runner';
import { jestTestAdapter } from '@atomic-testing/internal-test-runner-jest-adapter';

import { createPrimeVueTestEngine } from '../src/createPrimeVueTestEngine';
import { RadioButtonExample } from '../src/examples/radio-button/RadioButton.examples';
import { radioButtonTestSuite } from '../src/examples/radio-button/RadioButton.suite';

testRunner(radioButtonTestSuite, jestTestAdapter, {
  getTestEngine: scenePart => createPrimeVueTestEngine(RadioButtonExample, scenePart),
});
