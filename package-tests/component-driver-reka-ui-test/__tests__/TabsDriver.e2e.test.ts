import { testRunner } from '@atomic-testing/internal-test-runner';
import {
  getTestRunnerInterface,
  playWrightTestFrameworkMapper,
} from '@atomic-testing/internal-test-runner-playwright-adapter';

import { tabsTestSuite } from '../src/examples/tabs/Tabs.suite';

testRunner(tabsTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
