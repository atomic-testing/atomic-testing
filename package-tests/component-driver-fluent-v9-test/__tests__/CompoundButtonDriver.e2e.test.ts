import { testRunner } from '@atomic-testing/internal-test-runner';
import {
  getTestRunnerInterface,
  playWrightTestFrameworkMapper,
} from '@atomic-testing/internal-test-runner-playwright-adapter';

import { compoundButtonExampleTestSuite } from '../src/examples';

testRunner(compoundButtonExampleTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
