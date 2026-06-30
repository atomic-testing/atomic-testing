import { testRunner } from '@atomic-testing/internal-test-runner';
import {
  getTestRunnerInterface,
  playWrightTestFrameworkMapper,
} from '@atomic-testing/internal-test-runner-playwright-adapter';

import { basicAlertTestSuite } from '../src/examples';

testRunner(basicAlertTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
