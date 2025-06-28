import { testRunner } from '@atomic-testing/internal-test-runner';
import { getTestRunnerInterface, playWrightTestFrameworkMapper } from '@atomic-testing/playwright';

import {
  exclusiveSelectionTestSuite,
  regularSelectionButtonTestSuite,
  singleToggleButtonTestSuite,
} from '../src/examples';

testRunner(singleToggleButtonTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
testRunner(exclusiveSelectionTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
testRunner(regularSelectionButtonTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
