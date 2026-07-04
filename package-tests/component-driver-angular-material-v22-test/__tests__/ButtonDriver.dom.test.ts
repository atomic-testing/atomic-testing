import { createTestEngine } from '@atomic-testing/angular-22';
import { testRunner } from '@atomic-testing/internal-test-runner';
import { vitestAdapter } from '@atomic-testing/internal-test-runner-vitest-adapter';

import { ButtonExampleComponent } from '../src/examples/button/Button.examples';
import { buttonScenePart, buttonTestSuite } from '../src/examples/button/Button.suite';

// The Angular createTestEngine is async (bootstrap is inherently async, see
// ADR-013); useTestEngine awaits the promise before the first test runs.
testRunner(buttonTestSuite, vitestAdapter, {
  getTestEngine: (scenePart: typeof buttonScenePart) => createTestEngine(ButtonExampleComponent, scenePart),
});
