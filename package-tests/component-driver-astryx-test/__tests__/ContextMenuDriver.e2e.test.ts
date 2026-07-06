import { testRunner } from '@atomic-testing/internal-test-runner';
import { getTestRunnerInterface, playWrightTestFrameworkMapper } from '@atomic-testing/internal-test-runner-playwright-adapter';

import { contextMenuExampleTestSuite } from '../src/examples';

testRunner(contextMenuExampleTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
