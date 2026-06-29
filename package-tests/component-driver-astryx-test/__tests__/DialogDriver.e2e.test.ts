import { testRunner } from '@atomic-testing/internal-test-runner';
import { getTestRunnerInterface, playWrightTestFrameworkMapper } from '@atomic-testing/playwright';

import { dialogExampleTestSuite } from '../src/examples';

testRunner(dialogExampleTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
