import { testRunner } from '@atomic-testing/internal-test-runner';
import { getTestRunnerInterface, playWrightTestFrameworkMapper } from '@atomic-testing/playwright';

import { headingExampleTestSuite } from '../src/examples';

testRunner(headingExampleTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
