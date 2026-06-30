import { testRunner } from '@atomic-testing/internal-test-runner';
import {
  getTestRunnerInterface,
  playWrightTestFrameworkMapper,
} from '@atomic-testing/internal-test-runner-playwright-adapter';

import { basicPaginationTestSuite } from '../src/examples';

testRunner(basicPaginationTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
