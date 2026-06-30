import { testRunner } from '@atomic-testing/internal-test-runner';
import { getTestRunnerInterface, playWrightTestFrameworkMapper } from '@atomic-testing/playwright';

import { avatarExampleTestSuite } from '../src/examples';

testRunner(avatarExampleTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
