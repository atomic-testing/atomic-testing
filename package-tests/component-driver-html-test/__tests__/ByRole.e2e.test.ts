import { testRunner } from '@atomic-testing/internal-test-runner';
import {
  getTestRunnerInterface,
  playWrightTestFrameworkMapper,
} from '@atomic-testing/internal-test-runner-playwright-adapter';

import { byRoleExampleTestSuite } from '../src/examples';

testRunner(byRoleExampleTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
