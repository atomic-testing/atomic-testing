import { testRunner } from '@atomic-testing/internal-test-runner';
import { getTestRunnerInterface, playWrightTestFrameworkMapper } from '@atomic-testing/playwright';

import { chatComposerExampleTestSuite } from '../src/examples';

testRunner(chatComposerExampleTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
