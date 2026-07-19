import { testRunner } from '@atomic-testing/internal-test-runner';
import {
  getTestRunnerInterface,
  playWrightTestFrameworkMapper,
} from '@atomic-testing/internal-test-runner-playwright-adapter';

import { menuExampleTestSuite } from '../src/examples';

testRunner(menuExampleTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
