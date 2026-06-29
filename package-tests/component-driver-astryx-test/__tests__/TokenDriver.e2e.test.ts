import { testRunner } from '@atomic-testing/internal-test-runner';
import { getTestRunnerInterface, playWrightTestFrameworkMapper } from '@atomic-testing/playwright';

import { tokenExampleTestSuite } from '../src/examples';

testRunner(tokenExampleTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
