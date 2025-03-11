import { getTestRunnerInterface, playWrightTestFrameworkMapper } from '@atomic-testing/playwright';
import { testRunner } from '@atomic-testing/test-runner';

import { basicSnackbarTestSuite } from '../src/examples';

testRunner(basicSnackbarTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
