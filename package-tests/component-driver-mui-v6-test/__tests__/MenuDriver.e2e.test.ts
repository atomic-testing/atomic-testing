import { testRunner } from '@atomic-testing/internal-test-runner';
import { getTestRunnerInterface, playWrightTestFrameworkMapper } from '@atomic-testing/playwright';

import { accountMenuTestSuite } from '../src/examples';

testRunner(accountMenuTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
