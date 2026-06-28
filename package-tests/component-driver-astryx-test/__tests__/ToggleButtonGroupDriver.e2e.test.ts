import { testRunner } from '@atomic-testing/internal-test-runner';
import { getTestRunnerInterface, playWrightTestFrameworkMapper } from '@atomic-testing/playwright';

import { toggleButtonGroupExampleTestSuite } from '../src/examples';

testRunner(toggleButtonGroupExampleTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
