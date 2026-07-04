import { createTestEngine } from '@atomic-testing/angular-20';
import { testRunner } from '@atomic-testing/internal-test-runner';
import { vitestAdapter } from '@atomic-testing/internal-test-runner-vitest-adapter';

import { CheckboxExampleComponent } from '../src/examples/checkbox/Checkbox.examples';
import { checkboxScenePart, checkboxTestSuite } from '../src/examples/checkbox/Checkbox.suite';

testRunner(checkboxTestSuite, vitestAdapter, {
  getTestEngine: (scenePart: typeof checkboxScenePart) => createTestEngine(CheckboxExampleComponent, scenePart),
});
