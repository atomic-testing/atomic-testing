import { testRunner } from '@atomic-testing/internal-test-runner';
import {
  getTestRunnerInterface,
  playWrightTestFrameworkMapper,
} from '@atomic-testing/internal-test-runner-playwright-adapter';

import { basicSnackbarTestSuite } from '../src/examples';

testRunner(basicSnackbarTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
