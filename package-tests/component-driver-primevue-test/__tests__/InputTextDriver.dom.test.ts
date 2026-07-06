import { testRunner } from '@atomic-testing/internal-test-runner';
import { jestTestAdapter } from '@atomic-testing/internal-test-runner-jest-adapter';

import { createPrimeVueTestEngine } from '../src/createPrimeVueTestEngine';
import { InputTextExample } from '../src/examples/input-text/InputText.examples';
import { inputTextTestSuite } from '../src/examples/input-text/InputText.suite';

testRunner(inputTextTestSuite, jestTestAdapter, {
  getTestEngine: scenePart => createPrimeVueTestEngine(InputTextExample, scenePart),
});
