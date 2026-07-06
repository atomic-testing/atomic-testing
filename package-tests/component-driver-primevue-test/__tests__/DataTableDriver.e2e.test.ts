import { testRunner } from '@atomic-testing/internal-test-runner';
import {
  getTestRunnerInterface,
  playWrightTestFrameworkMapper,
} from '@atomic-testing/internal-test-runner-playwright-adapter';

import { dataTableTestSuite } from '../src/examples/data-table/DataTable.suite';

testRunner(dataTableTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
