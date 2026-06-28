import { testRunner } from '@atomic-testing/internal-test-runner';
import { getTestRunnerInterface, playWrightTestFrameworkMapper } from '@atomic-testing/playwright';

import { fieldStatusExampleTestSuite } from '../src/examples';

testRunner(fieldStatusExampleTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
