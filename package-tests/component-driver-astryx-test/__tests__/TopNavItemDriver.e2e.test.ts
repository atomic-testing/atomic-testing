import { testRunner } from '@atomic-testing/internal-test-runner';
import { getTestRunnerInterface, playWrightTestFrameworkMapper } from '@atomic-testing/internal-test-runner-playwright-adapter';

import { topNavItemExampleTestSuite } from '../src/examples';

testRunner(topNavItemExampleTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
