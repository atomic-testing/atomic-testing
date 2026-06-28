import { testRunner } from '@atomic-testing/internal-test-runner';
import { getTestRunnerInterface, playWrightTestFrameworkMapper } from '@atomic-testing/playwright';

import { basicAvatarTestSuite } from '../src/examples';

testRunner(basicAvatarTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
