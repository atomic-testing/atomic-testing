import { testRunner } from '@atomic-testing/internal-test-runner';
import {
  getTestRunnerInterface,
  playWrightTestFrameworkMapper,
} from '@atomic-testing/internal-test-runner-playwright-adapter';

import { dialogTestSuite } from '../src/examples/dialog/Dialog.suite';

testRunner(dialogTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
