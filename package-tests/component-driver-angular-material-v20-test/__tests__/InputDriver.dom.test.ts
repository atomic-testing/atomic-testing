import { createTestEngine } from '@atomic-testing/angular-20';
import { testRunner } from '@atomic-testing/internal-test-runner';
import { vitestAdapter } from '@atomic-testing/internal-test-runner-vitest-adapter';

import { InputExampleComponent } from '../src/examples/input/Input.examples';
import { inputScenePart, inputTestSuite } from '../src/examples/input/Input.suite';

testRunner(inputTestSuite, vitestAdapter, {
  getTestEngine: (scenePart: typeof inputScenePart) => createTestEngine(InputExampleComponent, scenePart),
});
