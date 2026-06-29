import { testRunner } from '@atomic-testing/internal-test-runner';
import { getTestRunnerInterface, playWrightTestFrameworkMapper } from '@atomic-testing/playwright';

import { textExampleTestSuite } from '../src/examples';

testRunner(textExampleTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
