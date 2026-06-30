import { testRunner } from '@atomic-testing/internal-test-runner';
import { getTestRunnerInterface, playWrightTestFrameworkMapper } from '@atomic-testing/playwright';

import { timestampExampleTestSuite } from '../src/examples';

testRunner(timestampExampleTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
