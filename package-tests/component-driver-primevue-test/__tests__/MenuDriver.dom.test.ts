import { testRunner } from '@atomic-testing/internal-test-runner';
import { jestTestAdapter } from '@atomic-testing/internal-test-runner-jest-adapter';

import { createPrimeVueTestEngine } from '../src/createPrimeVueTestEngine';
import { MenuExample } from '../src/examples/menu/Menu.examples';
import { menuTestSuite } from '../src/examples/menu/Menu.suite';

testRunner(menuTestSuite, jestTestAdapter, {
  getTestEngine: scenePart => createPrimeVueTestEngine(MenuExample, scenePart),
});
