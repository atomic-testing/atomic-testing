import { testRunner } from '@atomic-testing/internal-test-runner';
import {
  getTestRunnerInterface,
  playWrightTestFrameworkMapper,
} from '@atomic-testing/internal-test-runner-playwright-adapter';

import { timeInputExampleTestSuite } from '../src/examples';

testRunner(timeInputExampleTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
