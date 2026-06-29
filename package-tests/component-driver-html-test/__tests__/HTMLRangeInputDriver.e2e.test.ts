import { testRunner } from '@atomic-testing/internal-test-runner';
import { getTestRunnerInterface, playWrightTestFrameworkMapper } from '@atomic-testing/playwright';

import { rangeInputExampleTestSuite } from '../src/examples';

testRunner(rangeInputExampleTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
