import { testRunner } from '@atomic-testing/internal-test-runner';
import { getTestRunnerInterface, playWrightTestFrameworkMapper } from '@atomic-testing/playwright';

import { appShellExampleTestSuite } from '../src/examples';

testRunner(appShellExampleTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
