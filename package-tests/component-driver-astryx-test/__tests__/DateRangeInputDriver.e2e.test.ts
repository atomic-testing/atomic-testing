import { testRunner } from '@atomic-testing/internal-test-runner';
import {
  getTestRunnerInterface,
  playWrightTestFrameworkMapper,
} from '@atomic-testing/internal-test-runner-playwright-adapter';

import { dateRangeInputExampleTestSuite } from '../src/examples';

testRunner(dateRangeInputExampleTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
