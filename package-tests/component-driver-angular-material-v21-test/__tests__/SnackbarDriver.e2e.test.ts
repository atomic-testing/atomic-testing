import { testRunner } from '@atomic-testing/internal-test-runner';
import {
  getTestRunnerInterface,
  playWrightTestFrameworkMapper,
} from '@atomic-testing/internal-test-runner-playwright-adapter';

import { snackbarTestSuite } from '../src/examples/snackbar/Snackbar.suite';

testRunner(snackbarTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
