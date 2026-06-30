import { testRunner } from '@atomic-testing/internal-test-runner';
import {
  getTestRunnerInterface,
  playWrightTestFrameworkMapper,
} from '@atomic-testing/internal-test-runner-playwright-adapter';

import { activateExampleTestSuite } from '../src/examples';

testRunner(activateExampleTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
