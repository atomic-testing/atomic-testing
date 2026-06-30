import { testRunner } from '@atomic-testing/internal-test-runner';
import {
  getTestRunnerInterface,
  playWrightTestFrameworkMapper,
} from '@atomic-testing/internal-test-runner-playwright-adapter';

import { bannerExampleTestSuite } from '../src/examples';

testRunner(bannerExampleTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
