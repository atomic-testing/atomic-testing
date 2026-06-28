import { testRunner } from '@atomic-testing/internal-test-runner';
import { getTestRunnerInterface, playWrightTestFrameworkMapper } from '@atomic-testing/playwright';

import { inputGroupExampleTestSuite } from '../src/examples';

testRunner(inputGroupExampleTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
