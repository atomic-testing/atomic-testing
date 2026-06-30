import { testRunner } from '@atomic-testing/internal-test-runner';
import {
  getTestRunnerInterface,
  playWrightTestFrameworkMapper,
} from '@atomic-testing/internal-test-runner-playwright-adapter';

import { alertDialogExampleTestSuite } from '../src/examples';

testRunner(alertDialogExampleTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
