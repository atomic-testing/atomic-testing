import { testRunner } from '@atomic-testing/internal-test-runner';
import {
  getTestRunnerInterface,
  playWrightTestFrameworkMapper,
} from '@atomic-testing/internal-test-runner-playwright-adapter';

import { basicBottomNavigationTestSuite } from '../src/examples';

testRunner(basicBottomNavigationTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
