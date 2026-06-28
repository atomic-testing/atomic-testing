import { testRunner } from '@atomic-testing/internal-test-runner';
import { getTestRunnerInterface, playWrightTestFrameworkMapper } from '@atomic-testing/playwright';

import { scrollExampleTestSuite } from '../src/examples';

testRunner(scrollExampleTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
