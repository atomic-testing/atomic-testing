import { testRunner } from '@atomic-testing/internal-test-runner';
import { getTestRunnerInterface, playWrightTestFrameworkMapper } from '@atomic-testing/playwright';

import { basicTableTestSuite } from '../src/examples';

testRunner(basicTableTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
