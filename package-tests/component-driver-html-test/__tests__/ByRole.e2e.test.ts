import { testRunner } from '@atomic-testing/internal-test-runner';
import { getTestRunnerInterface, playWrightTestFrameworkMapper } from '@atomic-testing/playwright';

import { byRoleExampleTestSuite } from '../src/examples';

testRunner(byRoleExampleTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
