import { testRunner } from '@atomic-testing/internal-test-runner';
import {
  getTestRunnerInterface,
  playWrightTestFrameworkMapper,
} from '@atomic-testing/internal-test-runner-playwright-adapter';

import { radioExampleTestSuite } from '../src/examples';

testRunner(radioExampleTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
