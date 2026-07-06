import { testRunner } from '@atomic-testing/internal-test-runner';
import { getTestRunnerInterface, playWrightTestFrameworkMapper } from '@atomic-testing/internal-test-runner-playwright-adapter';

import { timestampExampleTestSuite } from '../src/examples';

testRunner(timestampExampleTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
