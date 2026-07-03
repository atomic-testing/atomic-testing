import { testRunner } from '@atomic-testing/internal-test-runner';
import {
  getTestRunnerInterface,
  playWrightTestFrameworkMapper,
} from '@atomic-testing/internal-test-runner-playwright-adapter';

import { menubarExampleTestSuite } from '../src/examples';

testRunner(menubarExampleTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
