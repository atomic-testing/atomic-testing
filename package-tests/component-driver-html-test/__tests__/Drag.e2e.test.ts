import { testRunner } from '@atomic-testing/internal-test-runner';
import { getTestRunnerInterface, playWrightTestFrameworkMapper } from '@atomic-testing/playwright';

import { dragExampleTestSuite } from '../src/examples';

testRunner(dragExampleTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
