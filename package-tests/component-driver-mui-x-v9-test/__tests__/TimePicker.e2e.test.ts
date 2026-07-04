import { testRunner } from '@atomic-testing/internal-test-runner';
import {
  getTestRunnerInterface,
  playWrightTestFrameworkMapper,
} from '@atomic-testing/internal-test-runner-playwright-adapter';

import { timePickerTestSuite } from '../src/examples';

testRunner(timePickerTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
