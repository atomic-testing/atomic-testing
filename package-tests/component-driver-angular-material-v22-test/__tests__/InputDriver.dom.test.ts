import { testRunner } from '@atomic-testing/internal-test-runner';
import { vitestAdapter } from '@atomic-testing/internal-test-runner-vitest-adapter';

import { createTestEngine } from '../src/createTestEngine';
import { InputExampleComponent } from '../src/examples/input/Input.examples';
import { inputScenePart, inputTestSuite } from '../src/examples/input/Input.suite';

testRunner(inputTestSuite, vitestAdapter, {
  getTestEngine: (scenePart: typeof inputScenePart) => createTestEngine(InputExampleComponent, scenePart),
});
