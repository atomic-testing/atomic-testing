import { testRunner } from '@atomic-testing/internal-test-runner';
import { getTestRunnerInterface, playWrightTestFrameworkMapper } from '@atomic-testing/playwright';

import { basicBadgeTestSuite } from '../src/examples';

testRunner(basicBadgeTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
