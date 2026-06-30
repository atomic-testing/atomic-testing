import { testRunner } from '@atomic-testing/internal-test-runner';
import {
  getTestRunnerInterface,
  playWrightTestFrameworkMapper,
} from '@atomic-testing/internal-test-runner-playwright-adapter';

import { accountMenuTestSuite } from '../src/examples';

testRunner(accountMenuTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
