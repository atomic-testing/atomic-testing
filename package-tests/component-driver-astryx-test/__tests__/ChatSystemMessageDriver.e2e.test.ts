import { testRunner } from '@atomic-testing/internal-test-runner';
import { getTestRunnerInterface, playWrightTestFrameworkMapper } from '@atomic-testing/internal-test-runner-playwright-adapter';

import { chatSystemMessageExampleTestSuite } from '../src/examples';

testRunner(chatSystemMessageExampleTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
