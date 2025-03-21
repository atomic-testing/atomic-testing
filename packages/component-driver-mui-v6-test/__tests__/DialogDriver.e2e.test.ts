import { getTestRunnerInterface, playWrightTestFrameworkMapper } from '@atomic-testing/playwright';
import { testRunner } from '@atomic-testing/test-runner';

import { alertDialogTestSuite, slideinDialogTestSuite } from '../src/examples';

testRunner(alertDialogTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());

testRunner(slideinDialogTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
