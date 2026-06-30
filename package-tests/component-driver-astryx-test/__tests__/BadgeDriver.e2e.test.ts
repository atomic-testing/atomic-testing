import { testRunner } from '@atomic-testing/internal-test-runner';
import { getTestRunnerInterface, playWrightTestFrameworkMapper } from '@atomic-testing/playwright';

import { badgeExampleTestSuite } from '../src/examples';

testRunner(badgeExampleTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
