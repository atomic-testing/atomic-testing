import { testRunner } from '@atomic-testing/internal-test-runner';
import {
  getTestRunnerInterface,
  playWrightTestFrameworkMapper,
} from '@atomic-testing/internal-test-runner-playwright-adapter';

import { mobileNavExampleTestSuite } from '../src/examples';

testRunner(mobileNavExampleTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
