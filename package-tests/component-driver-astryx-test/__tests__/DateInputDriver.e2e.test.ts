import { testRunner } from '@atomic-testing/internal-test-runner';
import { getTestRunnerInterface, playWrightTestFrameworkMapper } from '@atomic-testing/playwright';

import { dateInputExampleTestSuite } from '../src/examples';

testRunner(dateInputExampleTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
