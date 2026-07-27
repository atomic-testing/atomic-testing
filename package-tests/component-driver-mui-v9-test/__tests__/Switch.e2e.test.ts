import { testRunner } from '@atomic-testing/internal-test-runner';
import {
  getTestRunnerInterface,
  playWrightTestFrameworkMapper,
} from '@atomic-testing/internal-test-runner-playwright-adapter';

import { basicSwitchTestSuite } from '../src/examples';

testRunner(basicSwitchTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
