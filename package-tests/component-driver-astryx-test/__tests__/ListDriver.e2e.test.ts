import { testRunner } from '@atomic-testing/internal-test-runner';
import { getTestRunnerInterface, playWrightTestFrameworkMapper } from '@atomic-testing/playwright';

import { listExampleTestSuite } from '../src/examples';

testRunner(listExampleTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
