import { testRunner } from '@atomic-testing/internal-test-runner';
import {
  getTestRunnerInterface,
  playWrightTestFrameworkMapper,
} from '@atomic-testing/internal-test-runner-playwright-adapter';

import { powerSearchExampleTestSuite } from '../src/examples';

testRunner(powerSearchExampleTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
