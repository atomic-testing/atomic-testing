import { testRunner } from '@atomic-testing/internal-test-runner';
import { getTestRunnerInterface, playWrightTestFrameworkMapper } from '@atomic-testing/playwright';

import { toggleButtonExampleTestSuite } from '../src/examples';

testRunner(toggleButtonExampleTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
