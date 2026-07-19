import { testRunner } from '@atomic-testing/internal-test-runner';
import {
  getTestRunnerInterface,
  playWrightTestFrameworkMapper,
} from '@atomic-testing/internal-test-runner-playwright-adapter';

import { navExampleTestSuite } from '../src/examples';

testRunner(navExampleTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
