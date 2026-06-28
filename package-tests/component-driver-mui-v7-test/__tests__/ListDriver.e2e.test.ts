import { testRunner } from '@atomic-testing/internal-test-runner';
import { getTestRunnerInterface, playWrightTestFrameworkMapper } from '@atomic-testing/playwright';

import { plainListTestSuite, selectableListTestSuite } from '../src/examples';

testRunner(selectableListTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
testRunner(plainListTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
