import { testRunner } from '@atomic-testing/internal-test-runner';
import { getTestRunnerInterface, playWrightTestFrameworkMapper } from '@atomic-testing/playwright';

import { basicInputTestSuite } from '../src/examples';

testRunner(basicInputTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
