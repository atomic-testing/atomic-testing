import { testRunner } from '@atomic-testing/internal-test-runner';
import { getTestRunnerInterface, playWrightTestFrameworkMapper } from '@atomic-testing/playwright';

import { linkedElementTestSuite } from '../src/examples';

testRunner(linkedElementTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
