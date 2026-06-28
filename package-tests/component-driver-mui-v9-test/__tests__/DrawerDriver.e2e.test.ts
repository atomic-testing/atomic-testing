import { testRunner } from '@atomic-testing/internal-test-runner';
import { getTestRunnerInterface, playWrightTestFrameworkMapper } from '@atomic-testing/playwright';

import { basicDrawerTestSuite } from '../src/examples';

testRunner(basicDrawerTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
