import { testRunner } from '@atomic-testing/internal-test-runner';
import { getTestRunnerInterface, playWrightTestFrameworkMapper } from '@atomic-testing/playwright';

import { dateRangeInputExampleTestSuite } from '../src/examples';

testRunner(dateRangeInputExampleTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
