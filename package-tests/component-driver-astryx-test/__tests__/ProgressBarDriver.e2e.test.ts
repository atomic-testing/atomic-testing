import { testRunner } from '@atomic-testing/internal-test-runner';
import { getTestRunnerInterface, playWrightTestFrameworkMapper } from '@atomic-testing/playwright';

import { progressBarExampleTestSuite } from '../src/examples';

testRunner(progressBarExampleTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
