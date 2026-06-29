import { testRunner } from '@atomic-testing/internal-test-runner';
import { getTestRunnerInterface, playWrightTestFrameworkMapper } from '@atomic-testing/playwright';

import { hoverCardExampleTestSuite } from '../src/examples';

testRunner(hoverCardExampleTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
