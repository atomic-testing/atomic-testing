import { testRunner } from '@atomic-testing/internal-test-runner';
import {
  getTestRunnerInterface,
  playWrightTestFrameworkMapper,
} from '@atomic-testing/internal-test-runner-playwright-adapter';

import { navigationMenuExampleTestSuite } from '../src/examples';

testRunner(navigationMenuExampleTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
