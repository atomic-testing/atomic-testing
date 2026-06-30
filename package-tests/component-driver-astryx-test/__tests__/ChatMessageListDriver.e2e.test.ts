import { testRunner } from '@atomic-testing/internal-test-runner';
import { getTestRunnerInterface, playWrightTestFrameworkMapper } from '@atomic-testing/playwright';

import { chatMessageListExampleTestSuite } from '../src/examples';

testRunner(chatMessageListExampleTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
