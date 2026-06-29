import { testRunner } from '@atomic-testing/internal-test-runner';
import { getTestRunnerInterface, playWrightTestFrameworkMapper } from '@atomic-testing/playwright';

import { chatSendButtonExampleTestSuite } from '../src/examples';

testRunner(chatSendButtonExampleTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
