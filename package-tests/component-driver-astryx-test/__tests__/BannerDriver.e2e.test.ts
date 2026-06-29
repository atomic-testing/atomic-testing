import { testRunner } from '@atomic-testing/internal-test-runner';
import { getTestRunnerInterface, playWrightTestFrameworkMapper } from '@atomic-testing/playwright';

import { bannerExampleTestSuite } from '../src/examples';

testRunner(bannerExampleTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
