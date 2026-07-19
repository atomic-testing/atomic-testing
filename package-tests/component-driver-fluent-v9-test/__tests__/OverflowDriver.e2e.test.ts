import { testRunner } from '@atomic-testing/internal-test-runner';
import {
  getTestRunnerInterface,
  playWrightTestFrameworkMapper,
} from '@atomic-testing/internal-test-runner-playwright-adapter';

import { overflowExampleTestSuite } from '../src/examples';

testRunner(overflowExampleTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
