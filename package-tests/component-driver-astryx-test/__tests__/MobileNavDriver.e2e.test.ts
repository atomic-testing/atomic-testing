import { testRunner } from '@atomic-testing/internal-test-runner';
import { getTestRunnerInterface, playWrightTestFrameworkMapper } from '@atomic-testing/playwright';

import { mobileNavExampleTestSuite } from '../src/examples';

testRunner(mobileNavExampleTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
