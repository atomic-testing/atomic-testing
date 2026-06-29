import { testRunner } from '@atomic-testing/internal-test-runner';
import { getTestRunnerInterface, playWrightTestFrameworkMapper } from '@atomic-testing/playwright';

import { timeInputExampleTestSuite } from '../src/examples';

testRunner(timeInputExampleTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
