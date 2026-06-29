import { testRunner } from '@atomic-testing/internal-test-runner';
import { getTestRunnerInterface, playWrightTestFrameworkMapper } from '@atomic-testing/playwright';

import { spinnerExampleTestSuite } from '../src/examples';

testRunner(spinnerExampleTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
