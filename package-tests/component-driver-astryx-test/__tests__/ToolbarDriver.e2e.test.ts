import { testRunner } from '@atomic-testing/internal-test-runner';
import { getTestRunnerInterface, playWrightTestFrameworkMapper } from '@atomic-testing/playwright';

import { toolbarExampleTestSuite } from '../src/examples';

testRunner(toolbarExampleTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
