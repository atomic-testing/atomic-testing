import { testRunner } from '@atomic-testing/internal-test-runner';
import {
  getTestRunnerInterface,
  playWrightTestFrameworkMapper,
} from '@atomic-testing/internal-test-runner-playwright-adapter';

import { basicSpeedDialTestSuite } from '../src/examples';

testRunner(basicSpeedDialTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
