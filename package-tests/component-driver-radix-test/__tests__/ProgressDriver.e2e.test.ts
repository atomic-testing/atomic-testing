import { testRunner } from '@atomic-testing/internal-test-runner';
import {
  getTestRunnerInterface,
  playWrightTestFrameworkMapper,
} from '@atomic-testing/internal-test-runner-playwright-adapter';

import { progressExampleTestSuite } from '../src/examples';

testRunner(progressExampleTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
