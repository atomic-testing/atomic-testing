import { testRunner } from '@atomic-testing/internal-test-runner';
import {
  getTestRunnerInterface,
  playWrightTestFrameworkMapper,
} from '@atomic-testing/internal-test-runner-playwright-adapter';

import { navIconExampleTestSuite } from '../src/examples';

testRunner(navIconExampleTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
