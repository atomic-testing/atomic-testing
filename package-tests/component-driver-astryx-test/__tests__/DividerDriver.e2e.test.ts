import { testRunner } from '@atomic-testing/internal-test-runner';
import { getTestRunnerInterface, playWrightTestFrameworkMapper } from '@atomic-testing/playwright';

import { dividerExampleTestSuite } from '../src/examples';

testRunner(dividerExampleTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
