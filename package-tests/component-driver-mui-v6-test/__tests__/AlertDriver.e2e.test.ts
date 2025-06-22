import { getTestRunnerInterface, playWrightTestFrameworkMapper } from '@atomic-testing/playwright';
import { testRunner } from '@atomic-testing/internal-test-runner';

import { basicAlertTestSuite } from '../src/examples';

testRunner(basicAlertTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
