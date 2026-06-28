import { testRunner } from '@atomic-testing/internal-test-runner';
import { getTestRunnerInterface, playWrightTestFrameworkMapper } from '@atomic-testing/playwright';

import { basicDataGridPremiumTestSuite } from '../src/examples';

testRunner(basicDataGridPremiumTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
