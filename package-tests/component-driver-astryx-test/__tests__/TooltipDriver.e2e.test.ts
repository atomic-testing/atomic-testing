import { testRunner } from '@atomic-testing/internal-test-runner';
import { getTestRunnerInterface, playWrightTestFrameworkMapper } from '@atomic-testing/playwright';

import { tooltipExampleTestSuite } from '../src/examples';

testRunner(tooltipExampleTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
