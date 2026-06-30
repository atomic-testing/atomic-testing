import { testRunner } from '@atomic-testing/internal-test-runner';
import { getTestRunnerInterface, playWrightTestFrameworkMapper } from '@atomic-testing/playwright';

import { sideNavItemExampleTestSuite } from '../src/examples';

testRunner(sideNavItemExampleTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
