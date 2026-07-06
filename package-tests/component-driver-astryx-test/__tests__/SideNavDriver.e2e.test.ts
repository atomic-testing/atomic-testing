import { testRunner } from '@atomic-testing/internal-test-runner';
import { getTestRunnerInterface, playWrightTestFrameworkMapper } from '@atomic-testing/internal-test-runner-playwright-adapter';

import { sideNavExampleTestSuite } from '../src/examples';

testRunner(sideNavExampleTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
