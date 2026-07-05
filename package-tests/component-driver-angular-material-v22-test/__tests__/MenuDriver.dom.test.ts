import { createTestEngine } from '@atomic-testing/angular-22';
import { testRunner } from '@atomic-testing/internal-test-runner';
import { vitestAdapter } from '@atomic-testing/internal-test-runner-vitest-adapter';

import { MenuExampleComponent } from '../src/examples/menu/Menu.examples';
import { menuScenePart, menuTestSuite } from '../src/examples/menu/Menu.suite';

testRunner(menuTestSuite, vitestAdapter, {
  getTestEngine: (scenePart: typeof menuScenePart) => createTestEngine(MenuExampleComponent, scenePart),
});
