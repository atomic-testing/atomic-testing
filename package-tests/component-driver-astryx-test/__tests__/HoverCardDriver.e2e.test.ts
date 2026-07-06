import { testRunner } from '@atomic-testing/internal-test-runner';
import { getTestRunnerInterface, playWrightTestFrameworkMapper } from '@atomic-testing/internal-test-runner-playwright-adapter';

import { hoverCardExampleTestSuite } from '../src/examples';

testRunner(hoverCardExampleTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
