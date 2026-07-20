import { testRunner } from '@atomic-testing/internal-test-runner';
import {
  getTestRunnerInterface,
  playWrightTestFrameworkMapper,
} from '@atomic-testing/internal-test-runner-playwright-adapter';

import { messageBarExampleTestSuite } from '../src/examples';

testRunner(messageBarExampleTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
