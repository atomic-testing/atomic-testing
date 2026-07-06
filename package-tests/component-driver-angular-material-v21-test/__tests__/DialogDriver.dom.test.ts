import { testRunner } from '@atomic-testing/internal-test-runner';
import { vitestAdapter } from '@atomic-testing/internal-test-runner-vitest-adapter';

import { createTestEngine } from '../src/createTestEngine';
import { DialogExampleComponent } from '../src/examples/dialog/Dialog.examples';
import { dialogScenePart, dialogTestSuite } from '../src/examples/dialog/Dialog.suite';

testRunner(dialogTestSuite, vitestAdapter, {
  getTestEngine: (scenePart: typeof dialogScenePart) => createTestEngine(DialogExampleComponent, scenePart),
});
