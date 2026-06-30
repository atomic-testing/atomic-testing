import { testRunner } from '@atomic-testing/internal-test-runner';
import {
  getTestRunnerInterface,
  playWrightTestFrameworkMapper,
} from '@atomic-testing/internal-test-runner-playwright-adapter';

import { basicDatePickerTestSuite } from '../src/examples';

testRunner(basicDatePickerTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
