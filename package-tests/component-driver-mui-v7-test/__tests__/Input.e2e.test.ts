import { testRunner } from '@atomic-testing/internal-test-runner';
import {
  getTestRunnerInterface,
  playWrightTestFrameworkMapper,
} from '@atomic-testing/internal-test-runner-playwright-adapter';

import { basicInputTestSuite } from '../src/examples';

testRunner(basicInputTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
