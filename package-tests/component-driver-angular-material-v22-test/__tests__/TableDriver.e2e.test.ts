import { testRunner } from '@atomic-testing/internal-test-runner';
import {
  getTestRunnerInterface,
  playWrightTestFrameworkMapper,
} from '@atomic-testing/internal-test-runner-playwright-adapter';

import { tableTestSuite } from '../src/examples/table/Table.suite';

testRunner(tableTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
