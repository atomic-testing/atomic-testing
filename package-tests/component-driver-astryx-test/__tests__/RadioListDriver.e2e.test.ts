import { testRunner } from '@atomic-testing/internal-test-runner';
import { getTestRunnerInterface, playWrightTestFrameworkMapper } from '@atomic-testing/playwright';

import { radioListExampleTestSuite } from '../src/examples';

testRunner(radioListExampleTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
