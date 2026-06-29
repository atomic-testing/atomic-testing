import { testRunner } from '@atomic-testing/internal-test-runner';
import { getTestRunnerInterface, playWrightTestFrameworkMapper } from '@atomic-testing/playwright';

import { topNavMenuExampleTestSuite } from '../src/examples';

testRunner(topNavMenuExampleTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
