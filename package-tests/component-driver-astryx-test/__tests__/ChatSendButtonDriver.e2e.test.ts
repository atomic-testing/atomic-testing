import { testRunner } from '@atomic-testing/internal-test-runner';
import { getTestRunnerInterface, playWrightTestFrameworkMapper } from '@atomic-testing/internal-test-runner-playwright-adapter';

import { chatSendButtonExampleTestSuite } from '../src/examples';

testRunner(chatSendButtonExampleTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
