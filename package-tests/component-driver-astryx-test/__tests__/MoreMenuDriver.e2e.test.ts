import { testRunner } from '@atomic-testing/internal-test-runner';
import {
  getTestRunnerInterface,
  playWrightTestFrameworkMapper,
} from '@atomic-testing/internal-test-runner-playwright-adapter';

import { moreMenuExampleTestSuite } from '../src/examples';

testRunner(moreMenuExampleTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
