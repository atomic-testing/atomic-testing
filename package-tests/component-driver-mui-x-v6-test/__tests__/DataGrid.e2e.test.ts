import { testRunner } from '@atomic-testing/internal-test-runner';
import { getTestRunnerInterface, playWrightTestFrameworkMapper } from '@atomic-testing/playwright';

import { basicDataGridProTestSuite } from '../src/examples';

testRunner(basicDataGridProTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
