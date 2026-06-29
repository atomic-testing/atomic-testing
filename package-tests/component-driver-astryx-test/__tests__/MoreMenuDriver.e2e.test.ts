import { testRunner } from '@atomic-testing/internal-test-runner';
import { getTestRunnerInterface, playWrightTestFrameworkMapper } from '@atomic-testing/playwright';

import { moreMenuExampleTestSuite } from '../src/examples';

testRunner(moreMenuExampleTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
