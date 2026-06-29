import { testRunner } from '@atomic-testing/internal-test-runner';
import { getTestRunnerInterface, playWrightTestFrameworkMapper } from '@atomic-testing/playwright';

import { topNavMegaMenuExampleTestSuite } from '../src/examples';

testRunner(topNavMegaMenuExampleTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
