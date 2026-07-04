import { testRunner } from '@atomic-testing/internal-test-runner';
import {
  getTestRunnerInterface,
  playWrightTestFrameworkMapper,
} from '@atomic-testing/internal-test-runner-playwright-adapter';

import { tabsExampleTestSuite } from '../src/examples';

testRunner(tabsExampleTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
