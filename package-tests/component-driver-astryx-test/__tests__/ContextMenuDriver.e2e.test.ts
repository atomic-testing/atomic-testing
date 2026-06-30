import { testRunner } from '@atomic-testing/internal-test-runner';
import { getTestRunnerInterface, playWrightTestFrameworkMapper } from '@atomic-testing/playwright';

import { contextMenuExampleTestSuite } from '../src/examples';

testRunner(contextMenuExampleTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
