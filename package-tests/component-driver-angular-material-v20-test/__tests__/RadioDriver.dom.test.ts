import { createTestEngine } from '@atomic-testing/angular-20';
import { testRunner } from '@atomic-testing/internal-test-runner';
import { vitestAdapter } from '@atomic-testing/internal-test-runner-vitest-adapter';

import { RadioExampleComponent } from '../src/examples/radio/Radio.examples';
import { radioScenePart, radioTestSuite } from '../src/examples/radio/Radio.suite';

testRunner(radioTestSuite, vitestAdapter, {
  getTestEngine: (scenePart: typeof radioScenePart) => createTestEngine(RadioExampleComponent, scenePart),
});
