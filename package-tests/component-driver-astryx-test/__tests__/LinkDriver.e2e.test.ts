import { testRunner } from '@atomic-testing/internal-test-runner';
import { getTestRunnerInterface, playWrightTestFrameworkMapper } from '@atomic-testing/playwright';

import { linkExampleTestSuite } from '../src/examples';

testRunner(linkExampleTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
