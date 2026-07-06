import { testRunner } from '@atomic-testing/internal-test-runner';
import { jestTestAdapter } from '@atomic-testing/internal-test-runner-jest-adapter';

import { createPrimeVueTestEngine } from '../src/createPrimeVueTestEngine';
import { DataTableExample } from '../src/examples/data-table/DataTable.examples';
import { dataTableTestSuite } from '../src/examples/data-table/DataTable.suite';

testRunner(dataTableTestSuite, jestTestAdapter, {
  getTestEngine: scenePart => createPrimeVueTestEngine(DataTableExample, scenePart),
});
