import { testRunner } from '@atomic-testing/internal-test-runner';
import { jestTestAdapter } from '@atomic-testing/internal-test-runner-jest-adapter';
import { createTestEngine } from '@atomic-testing/vue-3';

import { TabsExample } from '../src/examples/tabs/Tabs.examples';
import { tabsTestSuite } from '../src/examples/tabs/Tabs.suite';

testRunner(tabsTestSuite, jestTestAdapter, {
  getTestEngine: scenePart => createTestEngine(TabsExample, scenePart),
});
