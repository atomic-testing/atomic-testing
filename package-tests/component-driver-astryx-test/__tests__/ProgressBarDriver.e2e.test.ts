import { testRunner } from '@atomic-testing/internal-test-runner';
import { getTestRunnerInterface, playWrightTestFrameworkMapper } from '@atomic-testing/internal-test-runner-playwright-adapter';

import { progressBarExampleTestSuite } from '../src/examples';

testRunner(progressBarExampleTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
