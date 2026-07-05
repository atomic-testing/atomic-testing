import { createTestEngine } from '@atomic-testing/angular-20';
import { testRunner } from '@atomic-testing/internal-test-runner';
import { vitestAdapter } from '@atomic-testing/internal-test-runner-vitest-adapter';

import { TabsExampleComponent } from '../src/examples/tabs/Tabs.examples';
import { tabsScenePart, tabsTestSuite } from '../src/examples/tabs/Tabs.suite';

testRunner(tabsTestSuite, vitestAdapter, {
  getTestEngine: (scenePart: typeof tabsScenePart) => createTestEngine(TabsExampleComponent, scenePart),
});
