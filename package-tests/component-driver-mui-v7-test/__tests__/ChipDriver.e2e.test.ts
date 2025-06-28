import { testRunner } from '@atomic-testing/internal-test-runner';
import { getTestRunnerInterface, playWrightTestFrameworkMapper } from '@atomic-testing/playwright';

import { basicChipTestSuite, clickableChipTestSuite, deletableChipTestSuite } from '../src/examples';

testRunner(basicChipTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());

testRunner(clickableChipTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());

testRunner(deletableChipTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
