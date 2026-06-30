import { testRunner } from '@atomic-testing/internal-test-runner';
import {
  getTestRunnerInterface,
  playWrightTestFrameworkMapper,
} from '@atomic-testing/internal-test-runner-playwright-adapter';

import { alertDialogTestSuite, slideinDialogTestSuite } from '../src/examples';

testRunner(alertDialogTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());

testRunner(slideinDialogTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
