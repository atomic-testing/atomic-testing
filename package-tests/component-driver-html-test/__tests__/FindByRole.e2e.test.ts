import { testRunner } from '@atomic-testing/internal-test-runner';
import {
  getTestRunnerInterface,
  playWrightTestFrameworkMapper,
} from '@atomic-testing/internal-test-runner-playwright-adapter';

import { findByRoleExampleTestSuite } from '../src/examples';

testRunner(findByRoleExampleTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
