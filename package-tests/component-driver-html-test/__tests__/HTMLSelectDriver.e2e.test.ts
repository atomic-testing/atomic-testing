import { testRunner } from '@atomic-testing/internal-test-runner';
import { getTestRunnerInterface, playWrightTestFrameworkMapper } from '@atomic-testing/playwright';

import { multipleSelectTestSuite, singleSelectTestSuite } from '../src/examples';

testRunner(singleSelectTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());

testRunner(multipleSelectTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
