import { testRunner } from '@atomic-testing/internal-test-runner';
import { getTestRunnerInterface, playWrightTestFrameworkMapper } from '@atomic-testing/playwright';

import { statusDotExampleTestSuite } from '../src/examples';

testRunner(statusDotExampleTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
