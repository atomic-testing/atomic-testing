import { testRunner } from '@atomic-testing/internal-test-runner';
import { getTestRunnerInterface, playWrightTestFrameworkMapper } from '@atomic-testing/playwright';

import { basicSnackbarTestSuite } from '../src/examples';

testRunner(basicSnackbarTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
