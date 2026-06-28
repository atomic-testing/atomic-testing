import { testRunner } from '@atomic-testing/internal-test-runner';
import { getTestRunnerInterface, playWrightTestFrameworkMapper } from '@atomic-testing/playwright';

import { activateExampleTestSuite } from '../src/examples';

testRunner(activateExampleTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
