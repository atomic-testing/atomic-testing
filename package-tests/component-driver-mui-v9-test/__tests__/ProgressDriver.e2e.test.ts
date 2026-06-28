import { testRunner } from '@atomic-testing/internal-test-runner';
import { getTestRunnerInterface, playWrightTestFrameworkMapper } from '@atomic-testing/playwright';

import { progressTestSuite } from '../src/examples';

testRunner(progressTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
