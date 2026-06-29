import { testRunner } from '@atomic-testing/internal-test-runner';
import { getTestRunnerInterface, playWrightTestFrameworkMapper } from '@atomic-testing/playwright';

import { chatComposerInputExampleTestSuite } from '../src/examples';

testRunner(chatComposerInputExampleTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
