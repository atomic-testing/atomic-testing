import { testRunner } from '@atomic-testing/internal-test-runner';
import { getTestRunnerInterface, playWrightTestFrameworkMapper } from '@atomic-testing/playwright';

import { tableExampleTestSuite } from '../src/examples';

testRunner(tableExampleTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
