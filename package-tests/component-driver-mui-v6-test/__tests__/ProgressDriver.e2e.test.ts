import { getTestRunnerInterface, playWrightTestFrameworkMapper } from '@atomic-testing/playwright';
import { testRunner } from '@atomic-testing/test-runner';

import { progressTestSuite } from '../src/examples';

testRunner(progressTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
