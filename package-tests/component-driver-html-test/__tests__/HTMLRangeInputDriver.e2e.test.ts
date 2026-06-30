import { testRunner } from '@atomic-testing/internal-test-runner';
import {
  getTestRunnerInterface,
  playWrightTestFrameworkMapper,
} from '@atomic-testing/internal-test-runner-playwright-adapter';

import { rangeInputExampleTestSuite } from '../src/examples';

testRunner(rangeInputExampleTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
