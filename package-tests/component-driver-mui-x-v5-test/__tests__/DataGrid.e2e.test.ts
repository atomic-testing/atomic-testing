import { getTestRunnerInterface, playWrightTestFrameworkMapper } from '@atomic-testing/playwright';
import { testRunner } from '@atomic-testing/internal-test-runner';

import { basicDataGridProTestSuite } from '../src/examples';

testRunner(basicDataGridProTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
