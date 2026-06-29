import { testRunner } from '@atomic-testing/internal-test-runner';
import { getTestRunnerInterface, playWrightTestFrameworkMapper } from '@atomic-testing/playwright';

import { topNavExampleTestSuite } from '../src/examples';

testRunner(topNavExampleTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
