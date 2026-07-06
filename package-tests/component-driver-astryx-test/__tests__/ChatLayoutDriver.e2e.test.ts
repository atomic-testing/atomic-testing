import { testRunner } from '@atomic-testing/internal-test-runner';
import { getTestRunnerInterface, playWrightTestFrameworkMapper } from '@atomic-testing/internal-test-runner-playwright-adapter';

import { chatLayoutExampleTestSuite } from '../src/examples';

testRunner(chatLayoutExampleTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
