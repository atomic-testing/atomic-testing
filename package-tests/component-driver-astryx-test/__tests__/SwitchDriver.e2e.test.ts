import { testRunner } from '@atomic-testing/internal-test-runner';
import { getTestRunnerInterface, playWrightTestFrameworkMapper } from '@atomic-testing/playwright';

import { switchControlExampleTestSuite } from '../src/examples';

testRunner(switchControlExampleTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
