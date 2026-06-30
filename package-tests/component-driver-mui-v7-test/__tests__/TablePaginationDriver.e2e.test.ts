import { testRunner } from '@atomic-testing/internal-test-runner';
import {
  getTestRunnerInterface,
  playWrightTestFrameworkMapper,
} from '@atomic-testing/internal-test-runner-playwright-adapter';

import { basicTablePaginationTestSuite } from '../src/examples';

testRunner(basicTablePaginationTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
