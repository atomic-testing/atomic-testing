import { testRunner } from '@atomic-testing/internal-test-runner';
import {
  getTestRunnerInterface,
  playWrightTestFrameworkMapper,
} from '@atomic-testing/internal-test-runner-playwright-adapter';

import { radioTestSuite } from '../src/examples/radio/Radio.suite';

testRunner(radioTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
