import { testRunner } from '@atomic-testing/internal-test-runner';
import { getTestRunnerInterface, playWrightTestFrameworkMapper } from '@atomic-testing/playwright';

import { blockquoteExampleTestSuite } from '../src/examples';

testRunner(blockquoteExampleTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
