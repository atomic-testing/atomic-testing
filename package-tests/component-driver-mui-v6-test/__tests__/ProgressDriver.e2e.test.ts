import { testRunner } from '@atomic-testing/internal-test-runner';
import {
  getTestRunnerInterface,
  playWrightTestFrameworkMapper,
} from '@atomic-testing/internal-test-runner-playwright-adapter';

import { progressTestSuite } from '../src/examples';

testRunner(progressTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
