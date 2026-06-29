import { testRunner } from '@atomic-testing/internal-test-runner';
import { getTestRunnerInterface, playWrightTestFrameworkMapper } from '@atomic-testing/playwright';

import { chatLayoutExampleTestSuite } from '../src/examples';

testRunner(chatLayoutExampleTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
