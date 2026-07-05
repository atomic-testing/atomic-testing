import { createTestEngine } from '@atomic-testing/angular-22';
import { testRunner } from '@atomic-testing/internal-test-runner';
import { vitestAdapter } from '@atomic-testing/internal-test-runner-vitest-adapter';

import { TableExampleComponent } from '../src/examples/table/Table.examples';
import { tableScenePart, tableTestSuite } from '../src/examples/table/Table.suite';

testRunner(tableTestSuite, vitestAdapter, {
  getTestEngine: (scenePart: typeof tableScenePart) => createTestEngine(TableExampleComponent, scenePart),
});
