import { testRunner } from '@atomic-testing/internal-test-runner';
import {
  getTestRunnerInterface,
  playWrightTestFrameworkMapper,
} from '@atomic-testing/internal-test-runner-playwright-adapter';

import { basicTabsTestSuite } from '../src/examples';

testRunner(basicTabsTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
