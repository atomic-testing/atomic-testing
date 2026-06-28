import { testRunner } from '@atomic-testing/internal-test-runner';
import { getTestRunnerInterface, playWrightTestFrameworkMapper } from '@atomic-testing/playwright';

import { basicSelectTestSuite } from '../src/examples';

testRunner(basicSelectTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
