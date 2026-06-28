import { testRunner } from '@atomic-testing/internal-test-runner';
import { getTestRunnerInterface, playWrightTestFrameworkMapper } from '@atomic-testing/playwright';

import { iconButtonExampleTestSuite } from '../src/examples';

testRunner(iconButtonExampleTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
