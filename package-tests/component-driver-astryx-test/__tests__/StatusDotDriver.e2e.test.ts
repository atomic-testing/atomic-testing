import { testRunner } from '@atomic-testing/internal-test-runner';
import {
  getTestRunnerInterface,
  playWrightTestFrameworkMapper,
} from '@atomic-testing/internal-test-runner-playwright-adapter';

import { statusDotExampleTestSuite } from '../src/examples';

testRunner(statusDotExampleTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
