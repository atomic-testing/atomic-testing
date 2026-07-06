import { testRunner } from '@atomic-testing/internal-test-runner';
import { vitestAdapter } from '@atomic-testing/internal-test-runner-vitest-adapter';

import { createTestEngine } from '../src/createTestEngine';
import { SelectExampleComponent } from '../src/examples/select/Select.examples';
import { selectScenePart, selectTestSuite } from '../src/examples/select/Select.suite';

testRunner(selectTestSuite, vitestAdapter, {
  getTestEngine: (scenePart: typeof selectScenePart) => createTestEngine(SelectExampleComponent, scenePart),
});
