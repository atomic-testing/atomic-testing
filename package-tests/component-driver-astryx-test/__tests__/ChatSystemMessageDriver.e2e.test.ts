import { testRunner } from '@atomic-testing/internal-test-runner';
import { getTestRunnerInterface, playWrightTestFrameworkMapper } from '@atomic-testing/playwright';

import { chatSystemMessageExampleTestSuite } from '../src/examples';

testRunner(chatSystemMessageExampleTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
