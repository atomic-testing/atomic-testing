import { getTestRunnerInterface, playWrightTestFrameworkMapper } from '@atomic-testing/playwright';
import { testRunner } from '@atomic-testing/test-runner';

import { linkedElementTestSuite } from '../src/examples';

testRunner(linkedElementTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
