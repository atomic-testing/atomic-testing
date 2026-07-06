import { testRunner } from '@atomic-testing/internal-test-runner';
import { jestTestAdapter } from '@atomic-testing/internal-test-runner-jest-adapter';

import { createPrimeVueTestEngine } from '../src/createPrimeVueTestEngine';
import { TabsExample } from '../src/examples/tabs/Tabs.examples';
import { tabsTestSuite } from '../src/examples/tabs/Tabs.suite';

testRunner(tabsTestSuite, jestTestAdapter, {
  getTestEngine: scenePart => createPrimeVueTestEngine(TabsExample, scenePart),
});
