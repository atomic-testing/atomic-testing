import { testRunner } from '@atomic-testing/internal-test-runner';
import {
  getTestRunnerInterface,
  playWrightTestFrameworkMapper,
} from '@atomic-testing/internal-test-runner-playwright-adapter';

import { tabListExampleTestSuite } from '../src/examples';

testRunner(tabListExampleTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
