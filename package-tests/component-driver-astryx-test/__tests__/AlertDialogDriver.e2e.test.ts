import { testRunner } from '@atomic-testing/internal-test-runner';
import { getTestRunnerInterface, playWrightTestFrameworkMapper } from '@atomic-testing/playwright';

import { alertDialogExampleTestSuite } from '../src/examples';

testRunner(alertDialogExampleTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
