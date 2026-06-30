import { testRunner } from '@atomic-testing/internal-test-runner';
import {
  getTestRunnerInterface,
  playWrightTestFrameworkMapper,
} from '@atomic-testing/internal-test-runner-playwright-adapter';

import { paginationExampleTestSuite } from '../src/examples';

testRunner(paginationExampleTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
