import { getTestRunnerInterface, playWrightTestFrameworkMapper } from '@atomic-testing/playwright';
import { testRunner } from '@atomic-testing/test-runner';

import { basicDatePickerTestSuite } from '../src/examples';

testRunner(basicDatePickerTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
